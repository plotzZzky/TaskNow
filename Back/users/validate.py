from django.contrib.auth.hashers import make_password
import re


def validate_password(password, pwd):
    return password == pwd and len(password) >= 8 and find_char(password)


# Verifica se tem letras e digitos na senha
def find_char(text):
    char = any(char.isalpha() for char in text)
    digit = any(char.isdigit() for char in text)
    return char and digit


def validate_answer(answer):
    if answer is not None and len(answer) > 3:
        return make_password(answer)
