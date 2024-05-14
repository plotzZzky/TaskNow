from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import ProjectModel
from .serializer import ProjectSerializer


class ProjectViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']
    serializer_class = ProjectSerializer
    queryset = ProjectModel.objects.all()

    def list(self, request, *args, **kwargs):
        """ Retorna a lista com todos os projetos """
        query = self.get_queryset()
        serializer = self.get_serializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """ Desativado """
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        """ Cria um novo projeto """
        try:
            title = request.data['title']
            desc = request.data.get('desc', '')
            user = request.user
            ProjectModel.objects.create(title=title, desc=desc, user=user)
            return Response({"msg": "Projeto criado!"}, status=status.HTTP_200_OK)
        except KeyError:
            return Response({'error': 'Nome invalido'}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """ Deleta um projeto """
        try:
            project_id = kwargs['pk']
            project = ProjectModel.objects.get(pk=project_id)
            project.delete()
            return Response({"msg": "Projeto deletado!"}, status=status.HTTP_200_OK)
        except KeyError:
            return Response({"error": "Projecto não encontrado"}, status=status.HTTP_400_BAD_REQUEST)
