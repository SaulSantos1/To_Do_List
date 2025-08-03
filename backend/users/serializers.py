from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import authenticate
from django.db.models import Q

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},  # ← Isso ativa o masking no DRF
        trim_whitespace=False,
        validators=[validate_password]
    )

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'telefone', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            telefone=validated_data.get('telefone', '')
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.CharField(required=False)
        self.fields['username'] = serializers.CharField(required=False)

    def validate(self, attrs):
        # Verifica se pelo menos um dos campos foi enviado
        if not attrs.get('username') and not attrs.get('email'):
            raise serializers.ValidationError('Must include either "username" or "email".')
        
        password = attrs.get('password')
        
        # Determina o campo de login
        if attrs.get('username'):
            user_identifier = attrs['username']
            user = authenticate(
                request=self.context.get('request'),
                username=user_identifier,
                password=password,
            )
        else:
            try:
                user = User.objects.get(email=attrs['email'])
                user = authenticate(
                    request=self.context.get('request'),
                    username=user.username,
                    password=password,
                )
            except User.DoesNotExist:
                user = None
        
        if not user:
            raise serializers.ValidationError('Unable to log in with provided credentials.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        refresh = self.get_token(user)
        
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {  # Adiciona os dados do usuário
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'telefone': user.telefone,
                'username': user.username,
                'email': user.email
            }
        }
        
        return data
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token

# No seu arquivo serializers.py, adicione:
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'telefone', 'email', 'foto_perfil']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'telefone': {'required': False},
            'email': {'required': False},
            'foto_perfil': {'required': False},
        }

    def update(self, instance, validated_data):
        # Atualiza campos regulares
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.telefone = validated_data.get('telefone', instance.telefone)
        
        print("Updating user profile with data:", validated_data)
        # Tratamento especial para a foto de perfil
        if 'foto_perfil' in validated_data:
            # Remove a foto antiga se existir
            if instance.foto_perfil:
                instance.foto_perfil.delete(save=False)
            instance.foto_perfil = validated_data['foto_perfil']
        
        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.foto_perfil:
            representation['foto_perfil'] = instance.foto_perfil.url
        else:
            representation['foto_perfil'] = None
        return representation