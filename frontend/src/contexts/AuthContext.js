import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    // Verifica se os valores existem e não são strings vazias
    if (storedUser && storedToken && storedUser !== 'undefined' && storedToken !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Limpa os valores inválidos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      setError(null);
      const isEmail = identifier.includes('@');
      const payload = {
        password: password,
        [isEmail ? 'email' : 'username']: identifier
      };
      
      const response = await api.post('/api/auth/login/', payload);
      console.log('Login response:', response.data);
      
      // Verifica se a resposta contém os dados esperados
      if (!response.data || !response.data.access || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      const { access, refresh, user } = response.data;
      
      // Garante que os dados sejam válidos antes de armazenar
      if (!access || !user) {
        throw new Error('Invalid authentication data');
      }
      
      localStorage.setItem('token', access);
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }
      localStorage.setItem('user', JSON.stringify(user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      setUser(user);
      navigate('/tasks');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.message || 
                          'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      await api.post('/api/auth/register/', userData);
      // Agora usa o username ou email para login após registro
      await login(userData.email || userData.username, userData.password);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}