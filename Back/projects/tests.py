from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from .models import ProjectModel


class ProjectTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'temporary',
            'password': '1234x567'}
        self.client = APIClient()
        self.user = User.objects.create_user(**self.credentials)
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.project = {
            "title": "Teste de Projeto",
            "desc": "Projeto para testes do Django",
        }

    def create_new_project(self):
        board = ProjectModel.objects.create(
            title=self.project['title'],
            desc=self.project['desc'],
            user=self.user
        )
        return board

    def test_get_all_projects_status_200(self):
        response = self.client.get('/projects/')
        self.assertEqual(response.status_code, 200)

    def test_get_all_projects_json(self):
        response = self.client.get('/projects/')
        self.assertEqual(response['Content-Type'], 'application/json')

    def test_get_all_projects_error_401(self):
        self.client.credentials()
        response = self.client.get('/projects/')
        self.assertEqual(response.status_code, 401)

    # Get project by id
    def test_get_project_by_id_error_405(self):
        """ Metodo não implementado """
        response = self.client.get('/projects/1/')
        self.assertEqual(response.status_code, 405)

    # create new project
    def test_create_new_project_status_200(self):
        response = self.client.post('/projects/', self.project)
        self.assertEqual(response.status_code, 200)

    def test_create_new_project_check_if_json(self):
        response = self.client.post('/projects/', self.project)
        self.assertEqual(response['Content-Type'], 'application/json')

    def test_create_new_projects_no_desc_status_200(self):
        del self.project['desc']
        response = self.client.post('/projects/', self.project)
        self.assertEqual(response.status_code, 200)

    def test_create_new_projects_no_title_error_400(self):
        del self.project['title']
        response = self.client.post('/projects/', self.project)
        self.assertEqual(response.status_code, 400)

    def test_delete_projects_status_200(self):
        new_project = self.create_new_project()
        response = self.client.delete(f'/projects/{new_project.id}/')
        self.assertEqual(response.status_code, 200)

    def test_delete_bard_check_if_deleted(self):
        new_project = self.create_new_project()
        self.client.delete(f'/projects/{new_project.id}/')
        try:
            board = ProjectModel.objects.get(pk=new_project.id)
        except ProjectModel.DoesNotExist:  # type:ignore
            board = None
        self.assertIsNone(board)
