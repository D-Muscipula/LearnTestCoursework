"""Модуль представлений для приложения тестирования."""

from rest_framework import viewsets, permissions
from .models import Test, Question, TestResult
from .serializer import (
    TestSerializer,
    QuestionSerializer,
    TestResultSerializer,
    UserRegistrationSerializer
)
from .permissions import (
    IsOwnerOrReadOnly,
    IsTeacherOrAdmin,
    IsStudentUser
)
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Возвращает результаты только текущего пользователя."""
        return TestResult.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        """Получение конкретного результата теста."""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except TestResult.DoesNotExist:
            return Response(
                {'error': 'Результат не найден'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    def create(self, request, *args, **kwargs):
        test_id = request.data.get('test')
        answers = request.data.get('answers', {})
        
        try:
            test = Test.objects.get(id=test_id)
        except Test.DoesNotExist:
            return Response(
                {'error': 'Тест не найден'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        correct_answers = 0
        total_questions = test.questions.count()
        
        for question in test.questions.all():
            correct_answer = question.answers.filter(is_correct=True).first()
            if correct_answer and str(answers.get(str(question.id))) == str(correct_answer.id):
                correct_answers += 1
        
        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        is_passed = score >= 70  # Проходной балл 70%
        
        result = TestResult.objects.create(
            user=request.user,
            test=test,
            score=score,
            is_passed=is_passed
        )
        
        serializer = self.get_serializer(result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'id': user.id, 
            'email': user.email
        })
