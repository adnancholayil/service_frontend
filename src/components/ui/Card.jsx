import React from 'react';

export const Card = ({
  className = '',
  children,
  hoverable = false,
  glass = false,
  ...props
}) => (
  <div
    className={`
      bg-card text-foreground border border-border/40 rounded-3xl overflow-hidden
      transition-all duration-300
      ${glass ? 'glass' : ''}
      ${hoverable ? 'card-hover cursor-pointer' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`px-6 py-5 border-b border-border/30 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ className = '', children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`px-6 py-5 bg-muted/20 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
