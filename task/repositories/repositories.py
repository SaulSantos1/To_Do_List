from django.core.exceptions import ObjectDoesNotExist
from ..models import Task

class TaskRepository:
    @staticmethod
    def get_all(user, filters=None):
        queryset = Task.objects.filter(usuario=user)
        if filters:
            queryset = queryset.filter(**filters)
        return queryset.order_by('-criado_em')
    
    @staticmethod
    def get_by_id(task_id, user):
        try:
            return Task.objects.get(id=task_id, usuario=user)
        except ObjectDoesNotExist:
            return None
    
    @staticmethod
    def create(task_data):
        return Task.objects.create(**task_data)
    
    @staticmethod
    def update(task, validated_data):
        for attr, value in validated_data.items():
            setattr(task, attr, value)
        task.save()
        return task
    
    @staticmethod
    def delete(task):
        task.delete()