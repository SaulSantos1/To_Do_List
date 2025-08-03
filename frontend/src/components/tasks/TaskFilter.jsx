import React from 'react';
import Button from '../ui/Button';

const TaskFilter = ({ filter, setFilter }) => {
  const filters = [
    { value: 'all', label: 'Todas' },
    { value: 'todo', label: 'A Fazer' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluídas' },
    { value: 'cancelled', label: 'Não Concluídas' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={filter === f.value ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter(f.value)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
};

export default TaskFilter;