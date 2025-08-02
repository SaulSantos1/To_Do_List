import pytest
from rest_framework.test import APIRequestFactory
from task.serializers import TaskSerializer
from task.tests.conftest import UserFactory


@pytest.mark.django_db
class TestTaskSerializer:
    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    def test_valid_serializer(self, user, factory):
        """Teste deve passar quando os dados são válidos"""
        request = factory.get("/")
        request.user = user

        data = {
            "titulo": "Tarefa Válida",
            "descricao": "Descrição válida",
            "status": "A_FAZER",
        }

        serializer = TaskSerializer(data=data, context={"request": request})
        assert serializer.is_valid()

        task = serializer.save()
        assert task.titulo == data["titulo"]
        assert task.usuario == user
        assert task.status == data["status"]

    def test_invalid_status(self, user, factory):
        """Teste deve falhar quando o status é inválido"""
        request = factory.get("/")
        request.user = user

        data = {
            "titulo": "Tarefa Inválida",
            "descricao": "Descrição",
            "status": "STATUS_INVALIDO",
        }

        serializer = TaskSerializer(data=data, context={"request": request})
        assert not serializer.is_valid()
        assert "status" in serializer.errors

    def test_update_serializer(self, task, factory):
        """Teste deve atualizar corretamente uma tarefa existente"""
        request = factory.get("/")
        request.user = task.usuario

        new_title = "Título Atualizado"
        data = {"titulo": new_title}

        serializer = TaskSerializer(
            instance=task, data=data, partial=True, context={"request": request}
        )
        assert serializer.is_valid()

        updated_task = serializer.save()
        assert updated_task.id == task.id
        assert updated_task.titulo == new_title
        assert updated_task.descricao == task.descricao  # Não deve mudar

    def test_create_with_different_user_fails(self, user, task, factory):
        """Teste deve falhar quando tentar criar tarefa para outro usuário"""
        different_user = UserFactory()  # Usando a factory do conftest

        request = factory.get("/")
        request.user = different_user  # Usuário logado é diferente do dono

        print("DIFERENTE", request.user.id, user.id)

        data = {
            "titulo": "Tarefa Não Autorizada",
            "descricao": "Não deveria funcionar",
            "status": "A_FAZER",
            "usuario": user.id,  # Tentando atribuir a outro usuário
        }

        serializer = TaskSerializer(data=data, context={"request": request})

        print(serializer)
        print("AAAA", serializer.is_valid())
        assert serializer.is_valid() is False
        assert "usuario" in serializer.errors

    def test_update_other_users_task_fails(self, task, factory):
        """Teste deve falhar ao tentar atualizar tarefa de outro usuário"""
        different_user = UserFactory()  # Outro usuário

        request = factory.get("/")
        request.user = different_user  # Não é o dono da tarefa

        data = {"titulo": "Tentativa de Alteração"}

        serializer = TaskSerializer(
            instance=task, data=data, partial=True, context={"request": request}
        )
        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors

    def test_admin_can_create_task_for_other_user(self, user, factory):
        """Teste deve passar quando admin cria tarefa para outro usuário"""
        # Cria um usuário admin
        admin_user = UserFactory(is_staff=True)

        request = factory.get("/")
        request.user = admin_user  # Usuário logado é admin

        data = {
            "titulo": "Tarefa Criada por Admin",
            "descricao": "Admin pode criar para outros",
            "status": "EM_ANDAMENTO",
            "usuario": user.id,  # Atribuindo a outro usuário
        }

        serializer = TaskSerializer(data=data, context={"request": request})
        assert serializer.is_valid()  # Deve ser válido para admin

        task = serializer.save()
        assert task.usuario.id == user.id  # Tarefa foi atribuída ao usuário correto
        assert task.titulo == data["titulo"]

    def test_admin_can_update_other_users_task(self, task, factory):
        """Teste deve passar quando admin atualiza tarefa de outro usuário"""
        admin_user = UserFactory(is_staff=True)

        request = factory.get("/")
        request.user = admin_user  # Usuário logado é admin

        new_data = {"titulo": "Título Alterado por Admin", "status": "CONCLUIDO"}

        serializer = TaskSerializer(
            instance=task, data=new_data, partial=True, context={"request": request}
        )
        assert serializer.is_valid()  # Deve ser válido

        updated_task = serializer.save()
        assert updated_task.titulo == new_data["titulo"]
        assert updated_task.status == new_data["status"]
        assert updated_task.usuario == task.usuario  # Dono original mantido
