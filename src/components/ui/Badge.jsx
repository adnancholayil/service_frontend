import React from 'react';

export const Badge = ({
  className = '',
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center gap-1 font-semibold rounded-full';

  const variants = {
    default:  'bg-muted text-muted-foreground',
    primary:  'bg-brand/12 text-brand',
    accent:   'bg-accent/12 text-accent',
    success:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    warning:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
    danger:   'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
    outline:  'border border-border text-muted-foreground',
    // Solid variants
    'solid-primary':  'bg-brand text-white',
    'solid-accent':   'bg-accent text-white',
    'solid-success':  'bg-emerald-500 text-white',
    'solid-warning':  'bg-yellow-500 text-white',
    'solid-danger':   'bg-red-500 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
