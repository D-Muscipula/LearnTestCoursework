"""Модуль представлений для приложения тестирования."""

from rest_framework import viewsets, permissions
from .models import Test, Question, TestResult
from .serializer import (
    TestSerializer,
    QuestionSerializer,
    TestResultSerializer
)
from .permissions import (
    IsOwnerOrReadOnly,
    IsTeacherOrAdmin,
    IsStudentUser
)

# Create your views here.


class TestViewSet(viewsets.ModelViewSet):
    """ViewSet для управления тестами."""
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsTeacherOrAdmin | IsOwnerOrReadOnly
    ]

    def get_queryset(self):
        """Возвращает опубликованные тесты или тесты текущего пользователя."""
        return Test.objects.filter(
            is_published=True
        ) | Test.objects.filter(
            created_by=self.request.user
        )


class QuestionViewSet(viewsets.ModelViewSet):
    """ViewSet для управления вопросами."""
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsTeacherOrAdmin
    ]


class TestResultViewSet(viewsets.ModelViewSet):
    """ViewSet для управления результатами тестов."""
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsStudentUser
    ]

    def get_queryset(self):
        """Возвращает результаты только текущего пользователя."""
        return TestResult.objects.filter(
            user=self.request.user
        )
