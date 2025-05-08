// frontend/components/LoginInputField.js

/**
 * Purpose:
 *  - A small reusable component that renders a label and input field together.
 *  - Used for cleaner forms and code reusability.
 */

import React from 'react';

/**
 * A simple reusable input field component
 * that renders a label and input together.
 */
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
