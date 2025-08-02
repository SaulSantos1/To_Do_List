import pytest
from task.tests.conftest import TaskFactory

@pytest.mark.django_db
class TestTaskService:
    def test_get_all(self, task_service, user):
        # Cria 3 tasks para o usuário
        tasks = [TaskFactory(usuario=user) for _ in range(3)]
        
        # Teste sem filtros
        result = task_service.get_all()
        assert len(result) == 3
        
        # Teste com filtro
        tasks[0].status = 'CONCLUIDO'
        tasks[0].save()
        result = task_service.get_all({'status': 'CONCLUIDO'})
        assert len(result) == 1
        assert result[0].status == 'CONCLUIDO'

    def test_get_by_id(self, task_service, task):
        found_task = task_service.get_by_id(task.id)
        assert found_task == task
        assert task_service.get_by_id(999) is None

    def test_create_task(self, task_service, user):
        task_data = {
            'titulo': 'New Task',
            'descricao': 'New Description',
            'status': 'A_FAZER',
            'usuario': user
        }
        
        task = task_service.create(task_data)
        assert task.id is not None
        assert task.titulo == 'New Task'

    def test_update_task(self, task_service, task):
        updated_task = task_service.update(task.id, {'titulo': 'Updated Title'})
        assert updated_task.titulo == 'Updated Title'
        assert task_service.update(999, {'titulo': 'Test'}) is None

    def test_delete_task(self, task_service, task):
        assert task_service.delete(task.id) is True
        assert task_service.get_by_id(task.id) is None
        assert task_service.delete(999) is False