import requests
import json

# Базовый URL API
BASE_URL = 'http://localhost:8000/api'


def get_auth_token(username, password):
    """Получение токена аутентификации."""
    response = requests.post(
        'http://localhost:8000/api-token-auth/',
        data={'username': username, 'password': password}
    )
    return response.json().get('token')


def test_api():
    """Тестирование основных эндпоинтов API."""
    # Получаем токен для преподавателя
    teacher_token = get_auth_token('teacher1', 'teacherpass')
    print("Токен преподавателя:", teacher_token)

    # Получаем токен для студента
    student_token = get_auth_token('student1', 'studentpass')
    print("Токен студента:", student_token)

    # Тестирование эндпоинта тестов
    headers = {'Authorization': f'Token {teacher_token}'}
    tests_response = requests.get(f'{BASE_URL}/tests/', headers=headers)
    print("\nТесты (преподаватель):")
    print(json.dumps(tests_response.json(), indent=2))

    # Тестирование создания теста
    new_test_data = {
        'title': 'Новый тест',
        'description': 'Тестовый тест',
        'time_limit': 45,
        'is_published': True
    }
    new_test_response = requests.post(
        f'{BASE_URL}/tests/',
        headers=headers,
        json=new_test_data
    )
    print("\nСоздание теста:")
    print(json.dumps(new_test_response.json(), indent=2))

    # Попытка студента создать тест (должна быть запрещена)
    student_headers = {'Authorization': f'Token {student_token}'}
    student_test_response = requests.post(
        f'{BASE_URL}/tests/',
        headers=student_headers,
        json=new_test_data
    )
    print("\nПопытка студента создать тест:")
    print("Статус:", student_test_response.status_code)
    print(student_test_response.text)


if __name__ == '__main__':
    test_api()
