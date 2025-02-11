from django.core.serializers import serialize
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import TaskModel, CommentModel
from projects.models import ProjectModel
from .serializers import TaskSerializer, CommentSerializer
from .utils import sorted_by_status


class TaskViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete']
    serializer_class = TaskSerializer

    def retrieve(self, request, *args, **kwargs):
        """ Retorna a lista com todas as tarefas do projeto atual """
        project_id = kwargs['pk']
        project = ProjectModel.objects.get(pk=project_id)  # Id do projeto com as tarefas
        query = TaskModel.objects.filter(project=project)
        serializer = self.get_serializer(query, many=True)
        items = sorted(serializer.data, key=sorted_by_status)

        return Response(items, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """ Cria uma nova tarefa """
        try:
            serializer = TaskSerializer(request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                return Response(status.HTTP_201_CREATED)

            return Response(status.HTTP_400_BAD_REQUEST)

        except (KeyError, ValueError, TypeError):
            return Response({"msg": "Não foi possivel criar a tarefa!"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """ Deleta um tarefa """
        try:
            task = self.get_object()
            task.delete()
            return Response(status.HTTP_200_OK)

        except (KeyError, ValueError, TypeError, TaskModel.DoesNotExist):  # type:ignore
            return Response({"error": "Tarefa não econtrada"}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        """ Permite mudar o status da tarefa """
        try:
            task_id = kwargs['pk']
            task_status = request.data['status']
            task = TaskModel.objects.get(pk=task_id)
            if 0 <= int(task_status) < 4:  # Impede que o valor seja alterado para alem da lista de status
                task.status = task_status
                task.save()

            return Response(status.HTTP_200_OK)
        except (KeyError, TypeError):
            return Response({"error": "Valores invalidos"}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)


class CommentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer
    queryset = CommentModel.objects.all()
    http_method_names = ['get', 'post', 'delete']

    def retrieve(self, request, *args, **kwargs):
        """ Retorna a lista de comentarios de uma tarefa """
        task_id = kwargs['pk']  # Este é o ID da tarefa e não do comentario
        task = TaskModel.objects.get(pk=task_id)
        serializer = CommentSerializer(task.comments.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """ Cria um novo comentario na tarefa atual """
        try:
            serializer = TaskSerializer(request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                return Response(status.HTTP_201_CREATED)

            return Response(status.HTTP_400_BAD_REQUEST)

        except (KeyError, ValueError):
            return Response(status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """ Deleta um comentario selecionado """
        try:
            comment = self.get_object()
            comment.delete()
            return Response(status.HTTP_200_OK)

        except (KeyError, ValueError, CommentModel.DoesNotExist):   # type: ignore
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
