import React from 'react';

const Select = ({ 
  options = [], 
  value, 
  onChange, 
  className = '', 
  label,
  error,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1 dark:text-white">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-danger' : 'border-gray-300 dark:border-gray-600'
        } dark:bg-slate-700 dark:text-white ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default Select;