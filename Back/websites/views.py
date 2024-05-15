from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import status

from .models import WebsiteModel
from .serializer import WebSiteSerializer


class WebsiteView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']
    serializer_class = WebSiteSerializer

    def list(self, request, *args, **kwargs):
        """ Retorna a lista de websites """
        query = WebsiteModel.objects.filter(user=request.user)
        serializer = self.get_serializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """ Desativado por não usado """
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        """ Cria um novo website """
        try:
            title = request.data.get('title', 'Novo site')
            url = request.data['url']
            color = request.data.get('color', '#FFFFFF')
            user = request.user
            WebsiteModel.objects.create(user=user, title=title, url=url, color=color)

            return Response({"text": "Site criado"}, status=status.HTTP_200_OK)
        except (KeyError, ValueError):
            return Response({"text": "Formulario incorreto"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            website_id = kwargs['pk']
            website = WebsiteModel.objects.get(pk=website_id)
            website.delete()

            return Response({"msg": "Website deletado!"}, status=status.HTTP_200_OK)
        except (ValueError, KeyError, TypeError, WebsiteModel.DoesNotExist):  # type:ignore
            return Response({"error": "Website não encontrado"}, status=status.HTTP_400_BAD_REQUEST)
