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
