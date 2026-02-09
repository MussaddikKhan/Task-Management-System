/** reusable input component */

import React from 'react';
import './Input.css';


const Input = ({
    label, 
    type = "text",
    name,
    value,
    onChange,
    error,
    required = false,
    placeholder = '',
    className = '',
    ...props
}) => {
    const inputClasses = `input ${error ? 'input-error': ''} ${className}`.trim();

    return (
        <div className="input-group">
            {label && (
                <label htmlFor={name} className="input-label">
                    {label}
                    {required && <span className="required"> *</span>}
                </label>
            )}
            <input 
                type = {type}
                id={name}
                name={name}
                value={value}
                onChange = {onChange}
                placeholder = {placeholder}
                className= {inputClasses}
                required = {required}
                {...props}
                />
                {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;