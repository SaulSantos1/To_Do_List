from django.db import models
from django.contrib.auth import get_user_model
import os

User = get_user_model()

def task_image_upload_path(instance, filename):
    return f'tasks/{instance.usuario.id}/{instance.id}/{filename}'

class Task(models.Model):

    STATUS_CHOICES = [
        ('A_FAZER', 'A Fazer'),
        ('EM_ANDAMENTO', 'Em Andamento'),
        ('CONCLUIDO', 'Concluído'),
        ('CANCELADO', 'Cancelado'),
    ]

    PRIORIDADE_CHOICES = [
        ('BAIXA', 'Baixa'),
        ('MEDIA', 'Média'),
        ('ALTA', 'Alta'),
    ]

    titulo = models.CharField('Titulo', max_length=250)
    descricao = models.TextField('Descrição', blank=True, null=True)
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='A_FAZER')
    prioridade = models.CharField('Prioridade', max_length=20, choices=PRIORIDADE_CHOICES, default='MEDIA')
    data_vencimento = models.DateField('Data de Vencimento', blank=True, null=True)
    criado_em = models.DateTimeField('Criado em', auto_now_add=True)
    atualizado_em = models.DateTimeField('Atualizado em', auto_now=True)
    usuario = models.ForeignKey(User, verbose_name='Usuário', on_delete=models.CASCADE, related_name='tarefas')
    imagem = models.ImageField('Imagem', upload_to=task_image_upload_path, blank=True, null=True)

    class Meta:
        verbose_name = 'Tarefa'
        verbose_name_plural = 'Tarefas'
    
    def __str__(self):
        return self.titulo
    
    def delete(self, *args, **kwargs):
        if self.imagem:
            if os.path.isfile(self.imagem.path):
                os.remove(self.imagem.path)
        super().delete(*args, **kwargs)