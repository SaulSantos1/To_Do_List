import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import TaskFormModal from './TaskFormModal';

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'ALTA':
        return 'bg-danger/10 text-danger';
      case 'MEDIA':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-success/10 text-success';
    }
  };

  const handleUpdate = async (updatedTaskData) => {
    try {
      await onUpdate(task.id, updatedTaskData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const markAsCompleted = () => {
    handleUpdate({ ...task, status: 'CONCLUIDO' });
  };

  const markAsCancelled = () => {
    handleUpdate({ ...task, status: 'CANCELADO' });
  };

  // Define as classes CSS baseadas no status
  const getStatusClasses = () => {
    if (task.status === 'CONCLUIDO') {
      return {
        cardBorder: 'border-l-4 border-green-500',
        textColor: 'text-green-600 dark:text-green-400',
        textSecondary: 'text-green-700 dark:text-green-300',
        buttonVariant: 'success'
      };
    }
    if (task.status === 'CANCELADO') {
      return {
        cardBorder: 'border-l-4 border-red-500',
        textColor: 'text-red-600 dark:text-red-400',
        textSecondary: 'text-red-700 dark:text-red-300',
        buttonVariant: 'danger'
      };
    }
    return {
      cardBorder: '',
      textColor: 'dark:text-white',
      textSecondary: 'text-gray-600 dark:text-gray-300',
      buttonVariant: 'outline'
    };
  };

  const statusClasses = getStatusClasses();

  return (
    <>
      {/* Card com borda colorida conforme status */}
      <Card className={`hover:shadow-lg transition-shadow ${statusClasses.cardBorder}`}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/tasks/${task.id}`} className="hover:underline">
              <h3 className={`font-semibold text-lg line-clamp-1 ${statusClasses.textColor}`}>
                {task.titulo}
              </h3>
            </Link>
            
            <div className="flex space-x-1">
              <Button 
                size="xs" 
                variant={task.status === 'CONCLUIDO' ? 'success' : 'outline'}
                onClick={markAsCompleted}
                className="px-2 py-1 text-xs"
                title="Marcar como concluída"
              >
                ✓
              </Button>
              <Button 
                size="xs" 
                variant={task.status === 'CANCELADO' ? 'danger' : 'outline'}
                onClick={markAsCancelled}
                className="px-2 py-1 text-xs"
                title="Cancelar tarefa"
              >
                ✕
              </Button>
            </div>
          </div>
          
          {task.descricao && (
            <p className={`text-sm mb-3 line-clamp-2 ${statusClasses.textSecondary}`}>
              {task.descricao}
            </p>
          )}
          
          {task.data_vencimento && (
            <p className={`text-sm mb-3 ${statusClasses.textColor}`}>
              Vence em: {new Date(task.data_vencimento).toLocaleDateString()}
            </p>
          )}
          
          <div className="flex justify-between items-center">
            <span className={`text-xs ${statusClasses.textColor}`}>
              {new Date(task.atualizado_em).toLocaleDateString()}
            </span>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditModalOpen(true)}
              >
                Editar
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                }}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        title="Editar Tarefa"
        initialData={{
          titulo: task.titulo,
          descricao: task.descricao,
          status: task.status,
          prioridade: task.prioridade,
          data_vencimento: task.data_vencimento
        }}
      />
    </>
  );
};

export default TaskCard;