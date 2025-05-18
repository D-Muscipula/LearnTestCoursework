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
        """Возвращает тесты в зависимости от роли пользователя."""
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Test.objects.all()
        
        if hasattr(user, 'is_teacher') and user.is_teacher:
            return Test.objects.filter(created_by=user)
        
        # Для студентов показываем только опубликованные тесты их группы
        return Test.objects.filter(
            is_published=True
        ).filter(
            allowed_groups__icontains=user.group_number
        )

    def perform_create(self, serializer):
        """Создание теста с проверкой прав."""
        if not (self.request.user.is_staff or 
                hasattr(self.request.user, 'is_teacher') and 
                self.request.user.is_teacher):
            raise permissions.PermissionDenied(
                "Только преподаватели могут создавать тесты"
            )
        serializer.save(created_by=self.request.user)


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
        """Возвращает результаты в зависимости от роли пользователя."""
        user = self.request.user
        
        # Для администраторов и преподавателей - все результаты
        if user.is_staff or (hasattr(user, 'is_teacher') and user.is_teacher):
            return TestResult.objects.select_related('test', 'user').all()
        
        # Для студентов - только их собственные результаты
        return TestResult.objects.filter(user=user).select_related('test', 'user')

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

        # Проверяем доступ к тесту
        if not test.is_published:
            return Response(
                {'error': 'Тест не опубликован'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Проверяем группу студента
        if not test.is_group_allowed(request.user.group_number):
            return Response(
                {'error': 'Тест недоступен для вашей группы'},
                status=status.HTTP_403_FORBIDDEN
            )

        correct_answers = 0
        total_questions = test.questions.count()

        for question in test.questions.all():
            correct_answer = question.answers.filter(is_correct=True).first()
            user_answer = str(answers.get(str(question.id)))
            if correct_answer and user_answer == str(correct_answer.id):
                correct_answers += 1

        score = (correct_answers / total_questions) * \
            100 if total_questions > 0 else 0
        is_passed = score >= 70  # Проходной балл 70%

        result = TestResult.objects.create(
            user=request.user,
            test=test,
            score=score,
            is_passed=is_passed
        )

        serializer = self.get_serializer(result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def teacher(self, request):
        """Получение результатов для преподавателя."""
        if not (request.user.is_staff or 
                (hasattr(request.user, 'is_teacher') and 
                 request.user.is_teacher)):
            return Response(
                {'detail': 'Доступ разрешен только преподавателям'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Получаем результаты всех тестов для преподавателей
        results = TestResult.objects.select_related('test', 'user').all()
        
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        is_teacher = (
            request.user.is_staff or 
            hasattr(request.user, 'is_teacher') and 
            request.user.is_teacher
        )
        
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'group_number': getattr(request.user, 'group_number', ''),
            'is_teacher': is_teacher
        })

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'id': user.id,
            'email': user.email
        })
