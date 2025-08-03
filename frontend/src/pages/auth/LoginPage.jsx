import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const LoginPage = () => {
  const [loginCredential, setLoginCredential] = useState(''); // Pode ser email ou username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(loginCredential, password); // Agora envia os dois parâmetros separados
      navigate('/tasks');
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Entrar na sua conta</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Email ou Nome de Usuário"
            value={loginCredential}
            onChange={(e) => setLoginCredential(e.target.value)}
            required
          />
          
          <Input
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="mb-4 text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <span className="text-gray-600 dark:text-gray-300">Não tem uma conta? </span>
          <Link 
            to="/register" 
            className="text-primary hover:underline"
          >
            Registrar
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;