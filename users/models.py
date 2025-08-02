from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    telefone = models.CharField(max_length=20, blank=True, null=True)
    foto_perfil = models.ImageField(upload_to='perfis/', blank=True, null=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
