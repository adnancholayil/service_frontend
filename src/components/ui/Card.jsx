import React from 'react';

export const Card = ({
  className = '',
  children,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-card text-foreground border border-border rounded-xl shadow-sm transition-all duration-200 overflow-hidden ${hoverable ? 'hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`p-4 border-b border-border ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ className = '', children, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`p-4 border-t border-border bg-zinc-50/50 dark:bg-zinc-900/50 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
