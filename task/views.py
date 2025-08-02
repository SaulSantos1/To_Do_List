from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import TaskSerializer
from .models import Task
from .services.services import TaskService

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        service = TaskService(self.request.user)
        status_filter = self.request.query_params.get('status', None)
        filters = {'status': status_filter} if status_filter else None
        return service.get_all(filters)

    def perform_create(self, serializer):
        service = TaskService(self.request.user)
        task = service.create(serializer.validated_data)
        return task

class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        service = TaskService(self.request.user)
        return service.get_all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        service = TaskService(request.user)
        task = service.update(instance.id, serializer.validated_data)
        
        if task:
            serializer = self.get_serializer(task)
            return Response({"message": "Tarefa atualizada com sucesso", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        service = TaskService(request.user)
        if service.delete(instance.id):
            return Response({"message": "Tarefa deletada com sucesso"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "Falha ao deletar tarefa"}, status=status.HTTP_400_BAD_REQUEST)