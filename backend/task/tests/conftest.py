import pytest
from django.contrib.auth import get_user_model
from factory.django import DjangoModelFactory
from faker import Faker

from task.models import Task
from task.services.services import TaskService


fake = Faker()
User = get_user_model()

# Factories para criar dados de teste
class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ('username',)

    username = fake.user_name()
    email = fake.email()
    password = fake.password()

class TaskFactory(DjangoModelFactory):
    class Meta:
        model = Task

    titulo = fake.sentence()
    descricao = fake.text()
    status = 'A_FAZER'
    usuario = None

# Fixtures pytest
@pytest.fixture
def user():
    return UserFactory()

@pytest.fixture
def task(user):
    return TaskFactory(usuario=user)

@pytest.fixture
def task_service(user):
    return TaskService(user)