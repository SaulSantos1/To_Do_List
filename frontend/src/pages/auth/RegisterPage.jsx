import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    telefone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password2) {
      return setError('As senhas não coincidem');
    }
    
    try {
      setError('');
      setLoading(true);
      await register(formData);
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Falha no registro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Criar uma conta</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="first_name"
              label="Nome"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            
            <Input
              type="text"
              name="last_name"
              label="Sobrenome"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            type="text"
            name="username"
            label="Nome de usuário"
            value={formData.username}
            onChange={handleChange}
            required
          />
          
          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input
            type="text"
            name="telefone"
            label="Telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
          
          <Input
            type="password"
            name="password"
            label="Senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <Input
            type="password"
            name="password2"
            label="Confirmar Senha"
            value={formData.password2}
            onChange={handleChange}
            required
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <span className="text-gray-600 dark:text-gray-300">Já tem uma conta? </span>
          <Link 
            to="/login" 
            className="text-primary hover:underline"
          >
            Entrar
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;