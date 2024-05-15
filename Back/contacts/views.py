from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import status

from .models import ContactModel
from .serializer import ContactSerializer


class ContactView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']
    serializer_class = ContactSerializer

    def list(self, request, *args, **kwargs):
        query = ContactModel.objects.filter(user=request.user)
        serializer = self.get_serializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """ Desativado por não ser necessario """
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        """ Cria um novo contato """
        try:
            name = request.data['name']
            telephone = request.data.get('telephone', '')
            email = request.data.get('email', '')
            color = request.data.get('color', '#FFFFFF')
            user = request.user
            ContactModel.objects.create(user=user, name=name, telephone=telephone, email=email, color=color)

            return Response({"text": "Contato criado"}, status=status.HTTP_200_OK)
        except (KeyError, ValueError, TypeError):
            return Response({"text": "Formulario incorreto"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            contact_id = kwargs['pk']
            contact = ContactModel.objects.get(pk=contact_id)
            contact.delete()

            return Response({"msg": "Contato deletado!"}, status=status.HTTP_200_OK)
        except (ValueError, KeyError, TypeError, ContactModel.DoesNotExist):  # type:ignore
            return Response(status=status.HTTP_400_BAD_REQUEST)
