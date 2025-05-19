from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from tests.models import Test, Question, Answer


class Command(BaseCommand):
    help = 'Создание тестовых данных для приложения LearnTest'

    def handle(self, *args, **kwargs):
        # Создаем группы
        teacher_group, _ = Group.objects.get_or_create(name='Teachers')
        student_group, _ = Group.objects.get_or_create(name='Students')

        # Создаем или получаем существующих пользователей
        teacher, teacher_created = User.objects.get_or_create(
            username='teacher1', 
            email='teacher1',
            defaults={
                'is_staff': True
            }
        )
        if teacher_created:
            teacher.set_password('teacherpass')
            teacher.save()
        teacher.groups.add(teacher_group)

        student, student_created = User.objects.get_or_create(
            username='student1'
        )
        if student_created:
            student.set_password('studentpass')
            student.save()
        student.groups.add(student_group)

        # Удаляем существующие тесты для этого преподавателя
        Test.objects.filter(created_by=teacher).delete()

        # Создаем тест
        test = Test.objects.create(
            title='Тестовый экзамен',
            description='Демонстрационный тест',
            created_by=teacher,
            time_limit=60,
            is_published=True
        )

        # Создаем вопросы
        question1 = Question.objects.create(
            test=test,
            text='Что такое Django?',
            order=1
        )

        # Создаем ответы
        Answer.objects.create(
            question=question1,
            text='Веб-фреймворк на Python',
            is_correct=True
        )
        Answer.objects.create(
            question=question1,
            text='База данных',
            is_correct=False
        )

        self.stdout.write(
            self.style.SUCCESS('Тестовые данные успешно созданы!')
        ) 