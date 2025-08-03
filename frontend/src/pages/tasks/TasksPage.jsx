import React, { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import Button from '../../components/ui/Button';
import TaskCard from '../../components/tasks/TaskCard';
import TaskFilter from '../../components/tasks/TaskFilter';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';

const TasksPage = () => {
  const {
    tasks,
    loading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();
  
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const statusFilter = filter !== 'all' ? { status: getStatusValue(filter) } : {};
    fetchTasks(1, statusFilter);
  }, [filter]);

  const getStatusValue = (filter) => {
    switch (filter) {
      case 'todo': return 'A_FAZER';
      case 'in-progress': return 'EM_ANDAMENTO';
      case 'completed': return 'CONCLUIDO';
      case 'cancelled': return 'CANCELADO';
      default: return null;
    }
  };

  const handlePageChange = (page) => {
    const statusFilter = filter !== 'all' ? { status: getStatusValue(filter) } : {};
    fetchTasks(page, statusFilter);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading && tasks.length === 0) {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Minhas Tarefas</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Nova Tarefa
        </Button>
      </div>

      <TaskFilter filter={filter} setFilter={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              onDelete={() => deleteTask(task.id)}
              onUpdate={updateTask}
            />
          ))
        ) : (
          <Card className="col-span-full p-4 text-center">
            Nenhuma tarefa encontrada. {filter !== 'all' && 'Tente alterar o filtro.'}
          </Card>
        )}
      </div>

      {pagination.count > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        title="Criar Nova Tarefa"
      />
    </div>
  );
};

export default TasksPage;