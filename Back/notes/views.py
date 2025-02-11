from django.core.exceptions import ObjectDoesNotExist
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
    serializer_class = NoteSerializer

    def retrieve(self, request, *args, **kwargs):
        """ Retorna a lista com todas as notas de um determinado board """
        try:
            board_id = kwargs['pk']  # Id do board de notas
            board = BoardModel.objects.get(pk=board_id)
            query = NotesModel.objects.filter(board=board)

            serializer = self.get_serializer(query, many=True)
            return Response(serializer.data, status.HTTP_200_OK)

        except (KeyError, ValueError, TypeError, ObjectDoesNotExist):
            return Response(status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        """ Cria uma nova nota """
        try:
            serializer = NoteSerializer(request.data, many=False)

            if serializer.is_valid():
                serializer.save()
                return Response(status.HTTP_201_CREATED)

            return Response(status.HTTP_400_BAD_REQUEST)

        except (KeyError, ValueError):
            return Response(status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """ Deleta a nota selecionada """
        try:
            note_id = kwargs['pk']
            note = NotesModel.objects.get(pk=note_id)
            note.delete()
            return Response(status.HTTP_200_OK)

        except (KeyError, ValueError, TypeError, NotesModel.DoesNotExist):  # type:ignore
            return Response({"error": "Não foi possivel deletar a nota!"}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)
