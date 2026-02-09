/** Reusable Button Component */

import React from 'react';
import './Button.css';

const Button = ({
    variant = 'primary',
    size = 'medium',
    disabled = false,
    onClick,
    children,
    className = '',
    type = 'button',
    ...props

}) => {
    const buttonClasses = `btn btn -${variant} btn-${size} ${className}`.trim();

    return (
        <button
        type = {type}
        className = {buttonClasses}
        disabled = {disabled}
        onClick = {onClick}
        {...props}
        >
            {children}
        </button>

    );
};

export default Button