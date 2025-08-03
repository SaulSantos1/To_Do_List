import pytest
from rest_framework import status
from rest_framework.test import APIClient
from task.tests.conftest import TaskFactory
from django.urls import reverse

@pytest.mark.django_db
class TestTaskAPI:
    @pytest.fixture(autouse=True)
    def setup(self, user):
        self.client = APIClient()
        self.client.force_authenticate(user=user)
        self.user = user
        self.task = TaskFactory(usuario=user)
        self.base_url = reverse('task-list-create')
        self.detail_url = reverse('task-retrieve-update-destroy', args=[self.task.id])

    def test_list_tasks(self):
        response = self.client.get(self.base_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1  # Verifica quantas tarefas vieram

    def test_create_task(self):
        data = {
            'titulo': 'API Created Task',
            'descricao': 'API Description',
            'status': 'A_FAZER',
        }
        response = self.client.post(self.base_url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['titulo'] == 'API Created Task'

    def test_retrieve_task(self):
        response = self.client.get(self.detail_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == self.task.id

    def test_update_task(self):
        data = {'titulo': 'Updated via API'}
        response = self.client.patch(self.detail_url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['titulo'] == 'Updated via API'
        assert response.data['message'] == 'Tarefa atualizada com sucesso'

    def test_delete_task(self):
        response = self.client.delete(self.detail_url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert response.data['message'] == 'Tarefa deletada com sucesso'
        
        # Verifica se foi realmente deletado
        response = self.client.get(self.detail_url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
