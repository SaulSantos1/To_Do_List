import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import TaskFormModal from '../../components/tasks/TaskFormModal';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/tasks/${id}/`);
        setTask(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdateTask = async (updatedData) => {
    try {
      setLoading(true);
      const response = await api.put(`/api/tasks/${id}/`, updatedData);
      setTask(response.data);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.response?.data || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      setLoading(true);
      await api.delete(`/api/tasks/${id}/`);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONCLUIDO':
        return 'text-success';
      case 'EM_ANDAMENTO':
        return 'text-warning';
      case 'CANCELADO':
        return 'text-danger';
      default:
        return 'text-primary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'ALTA':
        return 'text-danger';
      case 'MEDIA':
        return 'text-warning';
      default:
        return 'text-success';
    }
  };

  if (loading && !task) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-danger">
        {error}
      </Card>
    );
  }

  if (!task) {
    return (
      <Card className="p-4">
        Tarefa não encontrada
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Detalhes da Tarefa</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsEditModalOpen(true)}
          >
            Editar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteTask}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">{task.titulo}</h2>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                <p className={`font-medium ${getStatusColor(task.status)}`}>
                  {task.get_status_display}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Prioridade</span>
                <p className={`font-medium ${getPriorityColor(task.prioridade)}`}>
                  {task.get_prioridade_display}
                </p>
              </div>
              
              {task.criado_em && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Data de Criação</span>
                  <p className="font-medium">
                    {new Date(task.criado_em).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            {task.descricao && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Descrição</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {task.descricao}
                </p>
              </div>
            )}
          </div>
          
          <div className="border-l border-gray-200 dark:border-gray-600 pl-6">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Detalhes</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Criado em</span>
                <p className="font-medium">
                  {new Date(task.criado_em).toLocaleString()}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Atualizado em</span>
                <p className="font-medium">
                  {new Date(task.atualizado_em).toLocaleString()}
                </p>
              </div>
            </div>
            
            {task.imagem && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Imagem</h3>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={task.imagem} 
                    alt={task.titulo} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateTask}
        title="Editar Tarefa"
        initialData={{
          titulo: task.titulo,
          descricao: task.descricao,
          status: task.status,
          prioridade: task.prioridade,
          data_vencimento: task.data_vencimento,
        }}
      />
    </div>
  );
};

export default TaskDetailPage;