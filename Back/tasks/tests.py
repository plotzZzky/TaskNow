from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from .models import TaskModel
from projects.models import ProjectModel


class NotesTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'temporary',
            'password': '1234x567'}
        self.client = APIClient()
        self.user = User.objects.create_user(**self.credentials)
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.project = self.create_new_project()
        self.new_task = {
            "projectId": self.project.id,
            "title": "Teste",
            "desc": "Teste de nota!",
            "color": "#fff"
        }

    def create_new_project(self):
        project = ProjectModel.objects.create(
            title="Titulo de test",
            desc="Teste de descrição",
            user=self.user
        )
        return project

    def create_new_task(self):
        task = TaskModel.objects.create(
            project=self.project,
            title=self.new_task['title'],
            desc=self.new_task['desc'],
            status=1,

        )
        return task

    # Get all notes
    def test_get_all_tasks_status(self):
        response = self.client.get('/tasks/')
        self.assertEqual(response.status_code, 200)

    def test_get_all_tasks_status_no_login_error(self):
        self.client.credentials()
        response = self.client.get('/tasks/')
        self.assertEqual(response.status_code, 401)

    def test_get_all_tasks_check_json(self):
        response = self.client.get('/tasks/')
        self.assertEqual(response['Content-Type'], 'application/json')

    # Get note
    def test_get_all_tasks_by_id_status(self):
        """ Metodo não implementado """
        response = self.client.get('/tasks/1/')
        self.assertEqual(response.status_code, 405)

    # Create task
    def test_create_new_task(self):
        response = self.client.post('/tasks/', self.new_task)
        self.assertEqual(response.status_code, 200)

    def test_create_new_task_no_data_error_400(self):
        response = self.client.post('/tasks/')
        self.assertEqual(response.status_code, 400)

    def test_create_new_task_no_project_id_error_400(self):
        del self.new_task['projectId']
        response = self.client.post('/tasks/', self.new_task)
        self.assertEqual(response.status_code, 400)

    def test_create_new_task_no_title_error_400(self):
        del self.new_task['title']
        response = self.client.post('/tasks/', self.new_task)
        self.assertEqual(response.status_code, 400)

    def test_create_new_task_no_desc_200(self):
        del self.new_task['desc']
        response = self.client.post('/tasks/', self.new_task)
        self.assertEqual(response.status_code, 200)

    # Delete note
    def test_delete_task_status_200(self):
        task = self.create_new_task()
        response = self.client.delete(f'/tasks/{task.id}/')
        self.assertEqual(response.status_code, 200)
        try:
            result = TaskModel.objects.get(pk=task.id)
        except TaskModel.DoesNotExist:  # type:ignore
            result = None
        self.assertIsNone(result)

    def test_delete_task_not_id_error_400(self):
        response = self.client.delete('/tasks/1/')
        self.assertEqual(response.status_code, 400)

    def test_delete_task_id_error_400(self):
        note_id = 99999
        response = self.client.delete(f'/tasks/{note_id}/')
        self.assertEqual(response.status_code, 400)
