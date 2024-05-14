from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
import datetime

from .models import NotesModel
from boards.models import BoardModel


class NotesTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'temporary',
            'password': '1234x567'}
        self.client = APIClient()
        self.user = User.objects.create_user(**self.credentials)
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.board = self.create_new_board()
        self.new_note = {
            "boardId": self.board.id,
            "title": "Teste",
            "desc": "Teste de nota!",
            "color": "#fff"
        }

    def create_new_board(self):
        board = BoardModel.objects.create(
            title="Titulo de test",
            desc="Teste de descrição",
            user=self.user
        )
        return board

    def create_new_note(self):
        note = NotesModel.objects.create(
            board=self.board,
            title=self.new_note['title'],
            desc=self.new_note['desc'],
            color=self.new_note['color'],
            date=datetime.date.today()
        )
        return note

    # Get all notes
    def test_get_all_notes_status(self):
        response = self.client.get('/notes/')
        self.assertEqual(response.status_code, 200)

    def test_get_all_notes_status_no_login_error(self):
        self.client.credentials()
        response = self.client.get('/notes/')
        self.assertEqual(response.status_code, 401)

    def test_get_all_notes_check_json(self):
        response = self.client.get('/notes/')
        self.assertEqual(response['Content-Type'], 'application/json')

    # Get note
    def test_get_note_all_notes_error_405(self):
        """ Metodo não implementado """
        response = self.client.get('/notes/1/')
        self.assertEqual(response.status_code, 405)

    # Create note
    def test_create_note_status_200(self):
        response = self.client.post('/notes/', self.new_note)
        self.assertEqual(response.status_code, 200)
        note = NotesModel.objects.get(title=self.new_note['title'])
        self.assertIsNotNone(note)

    def test_create_note_no_title(self):
        data = self.new_note
        del data['title']
        response = self.client.post('/notes/', data)
        self.assertEqual(response.status_code, 200)

    def test_create_note_no_text_error(self):
        data = self.new_note
        del data['desc']
        response = self.client.post('/notes/', data)
        self.assertEqual(response.status_code, 400)

    def test_create_note_no_color(self):
        data = self.new_note
        del data['color']
        response = self.client.post('/notes/', data)
        self.assertEqual(response.status_code, 200)

    def test_create_note_no_desc_error_400(self):
        del self.new_note['desc']
        response = self.client.post('/notes/', self.new_note)
        self.assertEqual(response.status_code, 400)

    # Delete note
    def test_delete_note_status_200(self):
        note = self.create_new_note()
        response = self.client.delete(f'/notes/{note.id}/')
        self.assertEqual(response.status_code, 200)
        try:
            result = NotesModel.objects.get(pk=note.id)
        except NotesModel.DoesNotExist:  # type:ignore
            result = None
        self.assertIsNone(result)

    def test_delete_note_not_id_error_400(self):
        response = self.client.delete('/notes/1/')
        self.assertEqual(response.status_code, 400)

    def test_delete_note_id_error_400(self):
        note_id = 99999
        response = self.client.delete(f'/notes/{note_id}/')
        self.assertEqual(response.status_code, 400)

