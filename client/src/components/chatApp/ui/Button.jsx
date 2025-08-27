// Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  variant = 'ghost',
  size = 'md',
  onClick,
  className = '',
  children,
  icon: Icon,
  iconSize = 18,
  ...props
}) => {
  // Base classes that apply to all buttons
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  // Variant-specific classes
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };
  
  // Size-specific classes
  const sizeClasses = {
    sm: 'h-9 px-3 rounded-md text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  };
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={iconSize} className="mr-2" />}
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['default', 'ghost', 'outline', 'secondary', 'destructive']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'icon']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.elementType,
  iconSize: PropTypes.number,
};

export  {Button};