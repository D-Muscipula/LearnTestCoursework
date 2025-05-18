"""Модуль моделей для системы тестирования.

Содержит модели для работы с тестами, вопросами и ответами.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import (
    CharField, TextField, ForeignKey,
    DateTimeField, PositiveIntegerField, BooleanField
)

User = get_user_model()


class Test(models.Model):
    """Модель для хранения тестов"""
    title: CharField = models.CharField(
        max_length=200, verbose_name="Название теста")
    description: TextField = models.TextField(
        blank=True, null=True, verbose_name="Описание")
    created_by: ForeignKey = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Автор",
        related_name='tests'
    )
    created_at: DateTimeField = models.DateTimeField(
        auto_now_add=True, verbose_name="Дата создания")
    updated_at: DateTimeField = models.DateTimeField(
        auto_now=True, verbose_name="Дата обновления")
    time_limit: PositiveIntegerField = models.PositiveIntegerField(
        default=30,
        verbose_name="Лимит времени (минуты)"
    )
    is_published: BooleanField = models.BooleanField(
        default=False, verbose_name="Опубликован")
    allowed_groups: TextField = models.TextField(
        blank=True,
        verbose_name="Доступные группы",
        help_text="Список групп через запятую"
    )

    class Meta:
        """Мета-класс для настройки модели Test.

        Определяет:
        - Отображаемые имена в админке
        - Порядок сортировки по умолчанию
        """
        verbose_name = "Тест"
        verbose_name_plural = "Тесты"
        ordering = ['-created_at']

    def __str__(self) -> str:
        return str(self.title)

    def is_group_allowed(self, group: str) -> bool:
        """Проверяет, разрешен ли доступ для указанной группы."""
        if not self.allowed_groups:
            return False
        allowed_groups = [
            g.strip().lower() 
            for g in self.allowed_groups.split(',')
        ]
        return group.lower() in allowed_groups


class Question(models.Model):
    """Модель вопроса в тесте"""
    test: ForeignKey = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name='questions',
        verbose_name="Тест"
    )
    text: TextField = models.TextField(verbose_name="Текст вопроса")
    order: PositiveIntegerField = models.PositiveIntegerField(
        default=0,
        verbose_name="Порядковый номер"
    )

    class Meta:
        verbose_name = "Вопрос"
        verbose_name_plural = "Вопросы"
        ordering = ['order']

    def __str__(self):
        # pylint: disable=no-member
        return f"Вопрос {self.order} из теста {self.test.title}"


class Answer(models.Model):
    """Модель ответа для вопроса"""
    question: ForeignKey = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='answers',
        verbose_name="Вопрос"
    )
    text: TextField = models.TextField(verbose_name="Текст ответа")
    is_correct: BooleanField = models.BooleanField(
        default=False,
        verbose_name="Правильный ответ"
    )

    class Meta:
        verbose_name = "Ответ"
        verbose_name_plural = "Ответы"

    def __str__(self):
        # pylint: disable=no-member
        return f"Ответ к вопросу: {self.question.text[:50]}"


class TestResult(models.Model):
    """Результат прохождения теста пользователем"""
    user: 'models.ForeignKey' = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='test_results',
        verbose_name="Пользователь"
    )
    test: 'models.ForeignKey' = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name='results',
        verbose_name="Тест"
    )
    score: models.PositiveIntegerField = models.PositiveIntegerField(
        verbose_name="Набранные баллы"
    )
    passed_at: models.DateTimeField = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата прохождения"
    )
    is_passed: models.BooleanField = models.BooleanField(
        default=False,
        verbose_name="Тест пройден"
    )

    class Meta:
        verbose_name = "Результат теста"
        verbose_name_plural = "Результаты тестов"

    def __str__(self):
        # pylint: disable=no-member
        return f"Результат теста {self.test.title} для {self.user.username}"


User.add_to_class('group_number', models.CharField(
    max_length=50,
    blank=True,
    null=True,
    verbose_name="Номер группы"
))
