import React from 'react';

export const Badge = ({
  className = '',
  variant = 'default',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold';
  
  const variants = {
    default: 'bg-zinc-500 text-white shadow-xs',
    primary: 'bg-brand text-white shadow-xs',
    accent: 'bg-purple-500 text-white shadow-xs',
    success: 'bg-emerald-500 text-white shadow-xs',
    warning: 'bg-amber-500 text-white shadow-xs',
    danger: 'bg-rose-500 text-white shadow-xs',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
