from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from .models import BoardModel


class BoardTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'temporary',
            'password': '1234x567'}
        self.client = APIClient()
        self.user = User.objects.create_user(**self.credentials)
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.board = {
            "title": "Teste de Board",
            "desc": "Board para testes do Django",
        }

    def create_new_board(self):
        board = BoardModel.objects.create(
            title=self.board['title'],
            desc=self.board['desc'],
            user=self.user
        )
        return board

    def test_get_all_boards(self):
        response = self.client.get('/boards/')
        self.assertEqual(response.status_code, 200)

    def test_get_all_boards_json(self):
        response = self.client.get('/boards/')
        self.assertEqual(response['Content-Type'], 'application/json')

    def test_get_all_boards_error_401(self):
        self.client.credentials()
        response = self.client.get('/boards/')
        self.assertEqual(response.status_code, 401)

    # Get board by id
    def test_get_note_by_id_error_405(self):
        """ Metodo não implementado """
        response = self.client.get('/boards/1/')
        self.assertEqual(response.status_code, 405)

    # create new board
    def test_create_new_board_status_200(self):
        response = self.client.post('/boards/', self.board)
        self.assertEqual(response.status_code, 200)

    def test_create_new_board_check_if_json(self):
        response = self.client.post('/boards/', self.board)
        self.assertEqual(response['Content-Type'], 'application/json')

    def test_create_new_board_no_desc_status_200(self):
        del self.board['desc']
        response = self.client.post('/boards/', self.board)
        self.assertEqual(response.status_code, 200)

    def test_create_new_board_no_title_error_400(self):
        del self.board['title']
        response = self.client.post('/boards/', self.board)
        self.assertEqual(response.status_code, 400)

    def test_delete_board_status_200(self):
        new_board = self.create_new_board()
        response = self.client.delete(f'/boards/{new_board.id}/')
        self.assertEqual(response.status_code, 200)

    def test_delete_bard_check_if_deleted(self):
        new_board = self.create_new_board()
        self.client.delete(f'/boards/{new_board.id}/')
        try:
            board = BoardModel.objects.get(pk=new_board.id)
        except BoardModel.DoesNotExist:  # type:ignore
            board = None
        self.assertIsNone(board)
