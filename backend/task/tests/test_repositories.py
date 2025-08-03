import pytest
from django.core.exceptions import ObjectDoesNotExist
from task.repositories.repositories import TaskRepository
from task.models import Task

@pytest.mark.django_db
class TestTaskRepository:
    @pytest.fixture(autouse=True)
    def setup(self, user):
        self.user = user
        self.repository = TaskRepository()
        self.task_data = {
            'titulo': 'Test Task',
            'descricao': 'Test Description',
            'status': 'A_FAZER',
            'usuario': user
        }

    def test_create_task(self):
        task = self.repository.create(self.task_data)
        assert task.id is not None
        assert task.titulo == 'Test Task'
        assert task.usuario == self.user

    def test_get_by_id(self):
        task = self.repository.create(self.task_data)
        found_task = self.repository.get_by_id(task.id, task.usuario)
        assert found_task == task
        assert self.repository.get_by_id(999, self.user) is None

    def test_update_task(self):
        task = self.repository.create(self.task_data)
        updated_task = self.repository.update(task, {'titulo': 'Updated Title'})
        assert updated_task.titulo == 'Updated Title'
        task.refresh_from_db()
        assert task.titulo == 'Updated Title'

    def test_delete_task(self):
        task = self.repository.create(self.task_data)
        task_id = task.id
        self.repository.delete(task)
        with pytest.raises(ObjectDoesNotExist):
            Task.objects.get(id=task_id)