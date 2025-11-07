
import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, description, checked, onChange }) => {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-200">{label}</label>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default Checkbox;
