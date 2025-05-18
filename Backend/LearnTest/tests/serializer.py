"""Сериализаторы для приложения тестирования.

Содержит сериализаторы для моделей Test, Question, Answer и TestResult.
"""

from rest_framework import serializers
from .models import Test, Question, Answer, TestResult
from django.contrib.auth import get_user_model

User = get_user_model()


class AnswerSerializer(serializers.ModelSerializer):
    """Сериализатор Answer с скрытием правильности ответа."""
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']
        extra_kwargs = {
            # Скрываем правильность ответа при чтении
            'is_correct': {'write_only': True}
        }


class QuestionSerializer(serializers.ModelSerializer):
    """Сериализатор Question с вложенными ответами."""
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'answers']


class TestSerializer(serializers.ModelSerializer):
    """Сериализатор Test с вложенными вопросами."""
    questions = QuestionSerializer(many=True, read_only=True)
    created_by = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Test
        fields = [
            'id', 'title', 'description', 'created_by',
            'created_at', 'time_limit', 'is_published',
            'questions', 'allowed_groups'
        ]


class TestResultSerializer(serializers.ModelSerializer):
    """Сериализатор TestResult с результатами пользователя."""
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = TestResult
        fields = ['id', 'test', 'user', 'score', 'passed_at', 'is_passed']
        read_only_fields = ['passed_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    group_number = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 
            'first_name', 'last_name', 
            'group_number'
        ]

    def create(self, validated_data):
        group_number = validated_data.pop('group_number')
        user = User.objects.create_user(
            username=validated_data['email'],  # Используем email как username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.group_number = group_number
        user.save()
        return user
