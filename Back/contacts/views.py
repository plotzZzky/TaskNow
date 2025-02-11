from django.core.serializers import serialize
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

    def create(self, request, *args, **kwargs):
        """ Cria um novo contato """
        try:
            serializer = ContactSerializer(request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                return Response(status.HTTP_201_CREATED)

            return Response(status.HTTP_400_BAD_REQUEST)

        except (KeyError, ValueError, TypeError):
            return Response(status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            contact = self.get_object()
            contact.delete()
            return Response(status.HTTP_200_OK)

        except (ValueError, KeyError, TypeError, ContactModel.DoesNotExist):  # type:ignore
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)
