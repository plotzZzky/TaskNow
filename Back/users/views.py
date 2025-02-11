from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
import imghdr
import os

from .token import create_new_token
from .models import Recovery
from .serializer import UserSerializer
from .validate import validate_password, validate_answer


class UserView(ModelViewSet):
    """
        View de Registro de novos usuarios
    """
    serializer_class = UserSerializer
    queryset = []

    @permission_classes([IsAuthenticated])
    def list(self, request, *args, **kwargs):
        """ Retorna a o perfil do usuario """
        try:
            user = request.user
            serializer = self.get_serializer(user, many=False, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({'error': 'Usuario não existe!'}, status=status.HTTP_401_UNAUTHORIZED)

    def create(self, request, *args, **kwargs):
        try:
            serializer = UserSerializer(request.data, many=False)

            if serializer.is_valid():
                password = request.data['password']
                user = serializer.save()
                user.set_password(password)
                user.save()

                authenticate(username=user.username, password=password)
                token = create_new_token(user)

                answer = request.data['answer']
                answer_hashed = make_password(answer)  # salva a respota ja protegida por hash

                question = request.data['question']
                image = request.data.get('image', None)
                Recovery.objects.create(user=user, question=question, answer=answer_hashed, image=image)

                return Response({"token": token.key}, status=200)

            else:
                raise ValueError()

        except (AttributeError, KeyError, ValueError):
            return Response({"error": "Informações incorretas!"}, status=status.HTTP_401_UNAUTHORIZED)

        except IntegrityError as error:
            if 'auth_user_username_key' in str(error):
                field = 'Nome de usuario'
            else:
                field = 'O e-mail'
            msg = f"{field} já existe e não pode ser cadastrado!"
            return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)

    @permission_classes([IsAuthenticated])
    def partial_update(self, request, *args, **kwargs):
        try:
            serializer = UserSerializer(request.data, many=False)

            if serializer.is_valid():
                # Verificar se necessario
                image = request.data.get('image', None)
                imghdr.what(None, image.read())
                image_path = str(request.user.profile.image)

                if os.path.exists(image_path):
                    os.remove(image_path)

            user = serializer.save()

            try:
                answer = request.data.get('answer', None)
                new_answer = validate_answer(answer)
                user = request.user
                user.profile.answer = new_answer
                user.profile.save()
            except KeyError:
                pass

            password = request.data.get('password', "")
            pwd = request.data.get('pwd', "")
            if password == pwd:
                if validate_password(password, pwd):
                    user.set_password(password)

            user.save()
            return Response({"msg": "Dados atualizados!"}, status=status.HTTP_200_OK)

        except (KeyError, ValueError, ObjectDoesNotExist):
            return Response({"msg": "Não foi possivel atualizar!"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["POST"], url_path="login")
    def login(self, request, *args, **kwargs):
        try:
            password = request.data['password']
            username = request.data['username']

            user = authenticate(username=username, password=password)
            if user:
                token = create_new_token(user)
                return Response({"token": token.key}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Login incorreto!"}, status=status.HTTP_401_UNAUTHORIZED)
        except (KeyError, ValueError):
            return Response({"error": "Login incorreto"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["POST"], url_path="question")
    def your_question(self, request, *args, **kwargs):
        try:
            username = request.data['username']
            user = User.objects.get(username=username)
            question = user.profile.question
            return Response({"question": question}, status=status.HTTP_200_OK)

        except (KeyError, ValueError, ObjectDoesNotExist):
            return Response({"error": "Usuario não encontrado"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["POST"], url_path="recover")
    def recover_pwd(self, request, *args, **kwargs):
        try:
            username = request.data['username']
            answer = request.data['answer']
            password = request.data['password']
            pwd = request.data['pwd']
            user = User.objects.get(username=username)

            if check_password(answer, user.profile.answer):
                if validate_password(password, pwd):
                    user.set_password(password)
                    user.save()
                    return Response({"msg": "Senha atualizada!"}, status=200)
                else:
                    msg = "As senhas precisam ser iguais, no minimo uma letra, numero e 8 digitos!"
                    return Response({"error": msg}, status=500)
            else:
                raise ValueError()
        except (KeyError, ValueError, ObjectDoesNotExist):
            return Response({"error": "Resposta incorreta!"}, status=500)


    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def retrieve(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)
