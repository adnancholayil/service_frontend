import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'text', // text, rect, circle
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-zinc-200 dark:bg-zinc-800';
  
  const variants = {
    text: 'h-4 w-full rounded',
    rect: 'h-32 w-full rounded-lg',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="border border-border rounded-xl p-4 space-y-3 bg-card">
    <Skeleton variant="rect" className="h-40" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton variant="text" className="w-1/4 h-8 rounded-lg" />
      </div>
    </div>
  </div>
);

export default Skeleton;
