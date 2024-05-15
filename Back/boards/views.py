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
        except BoardModel.DoesNotExist:  # type:ignore
            return Response({"error": "Board não encontrado"}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """ Desativado por não ser usado """
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        """ Cria um novo board """
        try:
            title = request.data['title']
            desc = request.data.get('desc', '')
            user = request.user
            BoardModel.objects.create(user=user, title=title, desc=desc)
            return Response({"msg": "Novo board criado!"}, status=status.HTTP_200_OK)
        except (KeyError, ValueError, TypeError):
            return Response({"error": "Titulo não valido"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """ Deleta o board selecionado """
        try:
            board_id = kwargs['pk']
            board = BoardModel.objects.get(pk=board_id)
            board.delete()
            query = self.get_queryset()
            serializer = self.serializer_class(query, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except (KeyError, ValueError, TypeError, BoardModel.DoesNotExist):  # type:ignore
            return Response({"error": "Board não encontrado"}, status=status.HTTP_400_BAD_REQUEST)
