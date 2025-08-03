from ..repositories.repositories import TaskRepository

class TaskService:
    def __init__(self, user):
        self.user = user
        self.repository = TaskRepository()

    def get_all(self, filters=None):
        return self.repository.get_all(self.user, filters)

    def get_by_id(self, task_id):
        return self.repository.get_by_id(task_id, self.user)

    def create(self, task_data):
        return self.repository.create(task_data)

    def update(self, task_id, validated_data):
        task = self.get_by_id(task_id)
        if task:
            return self.repository.update(task, validated_data)
        return None

    def delete(self, task_id):
        task = self.get_by_id(task_id)
        if task:
            self.repository.delete(task)
            return True
        return False
