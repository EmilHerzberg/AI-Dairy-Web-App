/* components/LoginInputField.js */
import React from 'react';
export default function InputField({ label, type, value, onChange, id }) {
  return (
    <label className="flex flex-col">
      <span>{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="p-2 border rounded"
      />
    </label>
  );
}
