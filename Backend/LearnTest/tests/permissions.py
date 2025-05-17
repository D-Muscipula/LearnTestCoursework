"""Модуль кастомных прав доступа для приложения тестирования."""

from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Кастомное разрешение для редактирования объектов.

    Разрешает полный доступ только владельцу объекта,
    остальным - только чтение.
    """

    def has_object_permission(self, request, view, obj):
        """
        Проверка прав доступа для конкретного объекта.

        Read-only разрешен для любых запросов.
        Полный доступ только для владельца.
        """
        # Read-only разрешения для любых безопасных методов
        if request.method in permissions.SAFE_METHODS:
            return True

        # Проверка, является ли текущий пользователь владельцем
        return obj.created_by == request.user


class IsTeacherOrAdmin(permissions.BasePermission):
    """
    Разрешение только для преподавателей или администраторов.

    Позволяет создавать и управлять тестами 
    только авторизованным преподавателям.
    """

    def has_permission(self, request, view):
        """
        Проверка прав доступа для создания объектов.
        """
        # Разрешаем доступ только аутентифицированным пользователям
        if not request.user.is_authenticated:
            return False

        # Разрешаем доступ администраторам и преподавателям
        return (
            request.user.is_staff or
            request.user.groups.filter(name='Teachers').exists()
        )


class IsStudentUser(permissions.BasePermission):
    """
    Разрешение только для студентов.

    Позволяет проходить тесты только студентам.
    """

    def has_permission(self, request, view):
        """
        Проверка прав доступа для студентов.
        """
        # Разрешаем доступ только аутентифицированным пользователям
        if not request.user.is_authenticated:
            return False

        # Разрешаем доступ только студентам
        return request.user.groups.filter(name='Students').exists()
