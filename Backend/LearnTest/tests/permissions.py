"""Модуль кастомных прав доступа для приложения тестирования."""

from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Пользовательское разрешение для просмотра и изменения объектов.
    """

    def has_object_permission(self, request, view, obj):
        """
        Проверка прав доступа для конкретного объекта.

        Read-only разрешен для любых запросов.
        Полный доступ только для владельца.
        """
        # Разрешаем чтение для всех
        if request.method in permissions.SAFE_METHODS:
            return True

        # Разрешаем изменение только владельцу объекта
        return obj.created_by == request.user


class IsTeacherOrAdmin(permissions.BasePermission):
    """
    Пользовательское разрешение для проверки, 
    является ли пользователь учителем или администратором.
    """

    def has_permission(self, request, view):
        """
        Проверка прав доступа для создания объектов.
        """
        # Разрешаем доступ администраторам
        if request.user.is_staff or request.user.is_superuser:
            return True
        
        # Проверяем, является ли пользователь учителем
        return hasattr(request.user, 'is_teacher') and request.user.is_teacher


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
