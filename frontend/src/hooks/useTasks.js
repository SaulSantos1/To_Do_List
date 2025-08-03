  import { useState, useEffect } from 'react';
  import api from '../services/api';

  export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
      count: 0,
      totalPages: 1,
      currentPage: 1,
    });

    const fetchTasks = async (page = 1, filters = {}) => {
      try {
        setLoading(true);
        const response = await api.get('/api/tasks/', {
          params: {
            page,
            ...filters,
          },
        });
        setTasks(response.data.results || []);
        setPagination({
          count: response.data.count,
          totalPages: response.data.total_pages,
          currentPage: response.data.current_page,
        });
        setError(null);
      } catch (err) {
        setError(err.response?.data || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    const createTask = async (taskData) => {
      try {
        setLoading(true);
        const response = await api.post('/api/tasks/', taskData);
        // Recarregar a primeira página para mostrar a nova task
        await fetchTasks(1);
        return response.data;
      } catch (err) {
        setError(err.response?.data || 'Failed to create task');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const updateTask = async (id, taskData) => {
      try {
        setLoading(true);
        const response = await api.put(`/api/tasks/${id}/`, taskData);
        // Recarregar a página atual para refletir as mudanças
        await fetchTasks(pagination.currentPage);
        return response.data;
      } catch (err) {
        setError(err.response?.data || 'Failed to update task');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const deleteTask = async (id) => {
      try {
        setLoading(true);
        await api.delete(`/api/tasks/${id}/`);
        // Recarregar a página atual (ou voltar uma página se esta ficar vazia)
        const newPage = tasks.length === 1 && pagination.currentPage > 1 
          ? pagination.currentPage - 1 
          : pagination.currentPage;
        await fetchTasks(newPage);
      } catch (err) {
        setError(err.response?.data || 'Failed to delete task');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    return {
      tasks,
      loading,
      error,
      pagination,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
    };
  }