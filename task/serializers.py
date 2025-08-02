from rest_framework import serializers
from .models import Task
from django.contrib.auth import get_user_model

User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = ['id', 'titulo', 'descricao', 'status', 'criado_em', 'atualizado_em', 'usuario']
        read_only_fields = ['id', 'atualizado_em']

    def validate_status(self, value):
        if value not in dict(Task.STATUS_CHOICES).keys():
            raise serializers.ValidationError("Escolha de status inválida.")
        return value
    
    def validate(self, attrs):
        request = self.context.get('request')
        usuario = attrs.get('usuario')

        instance = getattr(self, 'instance', None)
        if instance is not None and instance.usuario != request.user and not request.user.is_staff:
            raise serializers.ValidationError({
                'non_field_errors': 'Você não tem permissão para editar esta tarefa.'
            })

        if usuario is not None:
            if usuario != request.user and not request.user.is_staff:
                raise serializers.ValidationError({
                    'usuario': 'Você só pode criar tarefas para si mesmo.'
                })
        else:
            attrs['usuario'] = request.user

        return attrs