import React from 'react';

export default function InputField({ label, type, value, onChange, id }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="form-control"
      />
    </div>
  );
}
