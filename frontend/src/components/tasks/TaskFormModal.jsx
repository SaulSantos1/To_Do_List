import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = 'Formulário de Tarefa',
  initialData = {} 
}) => {
  const [formData, setFormData] = useState({
    titulo: initialData.titulo || '',
    descricao: initialData.descricao || '',
    status: initialData.status || 'A_FAZER',
    prioridade: initialData.prioridade || 'MEDIA',
    criado_em: initialData.criado_em ? new Date(initialData.criado_em) : null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'A_FAZER', label: 'A Fazer' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CONCLUIDO', label: 'Concluído' },
    { value: 'CANCELADO', label: 'Não concluído' },
  ];

  const priorityOptions = [
    { value: 'BAIXA', label: 'Baixa' },
    { value: 'MEDIA', label: 'Média' },
    { value: 'ALTA', label: 'Alta' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo) {
      return setError('O título é obrigatório');
    }
    
    try {
      setError('');
      setLoading(true);
      
      const dataToSubmit = {
        ...formData,
        data_vencimento: formData.data_vencimento?.toISOString().split('T')[0] || null,
      };
      
      await onSubmit(dataToSubmit);
      onClose();
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao salvar a tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <Input
          name="titulo"
          label="Título"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
        
        <Input
          name="descricao"
          label="Descrição"
          value={formData.descricao}
          onChange={handleChange}
          as="textarea"
          rows={3}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
          
          <Select
            name="prioridade"
            label="Prioridade"
            value={formData.prioridade}
            onChange={handleChange}
            options={priorityOptions}
          />
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;