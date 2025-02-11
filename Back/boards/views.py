from django.core.exceptions import ObjectDoesNotExist
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


from .serializer import BoardSerializer
from .models import BoardModel


class BoardsView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']
    serializer_class = BoardSerializer

    def list(self, request, *args, **kwargs):
        """ Retorna todos os boards do usuario """
        try:
            query = BoardModel.objects.filter(user=request.user)
            serializer = self.serializer_class(query, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        """ Cria um novo board """
        try:
            serializer = BoardSerializer(request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                return Response(status.HTTP_201_CREATED)

            return Response(status.HTTP_400_BAD_REQUEST)

        except (KeyError, ValueError, TypeError):
            return Response(status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """ Deleta o board selecionado """
        try:
            board = self.get_object()
            board.delete()
            return Response(status.HTTP_200_OK)

        except (KeyError, ValueError, TypeError, BoardModel.DoesNotExist):  # type:ignore
            return Response(status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)
