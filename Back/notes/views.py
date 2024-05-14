from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
import datetime

from .models import NotesModel, BoardModel
from .serializer import NoteSerializer


class NoteView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']
    queryset = NotesModel.objects.all()
    serializer_class = NoteSerializer

    def list(self, request, *args, **kwargs):
        """ Retorna a lista com todas as notas"""
        query = self.get_queryset()
        serializer = self.get_serializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """ Desativado por não ser necessario """
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        """ Cria uma nova nota """
        try:
            board_id = request.data['boardId']
            board = BoardModel.objects.get(pk=board_id)
            title = request.data.get('title', 'Nova Nota').title()
            desc = request.data['desc'].capitalize()
            date = datetime.date.today()
            color = request.data.get('color', '#FFF')
            NotesModel.objects.create(board=board, title=title, desc=desc, date=date, color=color)
            return Response({"text": "Nota criada"}, status=status.HTTP_200_OK)
        except (KeyError, ValueError):
            return Response({"text": "Formulario incorreto"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """ Deleta a nota selecionada """
        try:
            note_id = kwargs['pk']
            note = NotesModel.objects.get(pk=note_id)
            note.delete()
            return Response({"msg": "Nota deletada!"}, status=status.HTTP_200_OK)
        except (KeyError, ValueError, TypeError, NotesModel.DoesNotExist):  # type:ignore
            return Response({"error": "Não foi possivel deletar a nota!"}, status=status.HTTP_400_BAD_REQUEST)
