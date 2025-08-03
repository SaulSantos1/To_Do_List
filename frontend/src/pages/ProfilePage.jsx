import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        telefone: user.telefone || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const response = await api.put('/api/auth/user/update/', formData);
      
      updateUser(response.data);
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Falha ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('foto_perfil', file);
      
      const response = await api.put('/api/auth/user/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      updateUser(response.data);
      setSuccess('Foto de perfil atualizada com sucesso!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Falha ao atualizar foto de perfil');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Meu Perfil</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </div>

      <Card className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                {success}
              </div>
            )}
            
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                {user.foto_perfil ? (
                  <img 
                    src={`${API_BASE_URL}${user.foto_perfil}`} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
                  title="Alterar foto"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Clique no ícone para alterar sua foto de perfil
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="first_name"
                label="Nome"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              
              <Input
                name="last_name"
                label="Sobrenome"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <Input
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
            
            <Input
              type="text"
              name="telefone"
              label="Telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            {/* Seção da foto e nome */}
            <div className="flex flex-row items-center md:items-start justify-center gap-6">
              {/* Foto de perfil */}
              <div className="flex flex-col items-center">
                {user.foto_perfil ? (
                  <img 
                    src={`${API_BASE_URL}${user.foto_perfil}`} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <h2 className="text-xl font-semibold dark:text-white mt-4">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              </div>
            </div>
            
            {/* Seção das informações detalhadas */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome completo</h3>
                <p className="dark:text-white text-lg">
                  {user.first_name} {user.last_name}
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                <p className="dark:text-white text-lg">{user.email}</p>
              </div>
              
              {user.telefone && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</h3>
                  <p className="dark:text-white text-lg">{user.telefone}</p>
                </div>
              )}
              
              {/* Adicione mais campos conforme necessário */}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;