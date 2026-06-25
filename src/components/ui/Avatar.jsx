import React from 'react';

export const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md', // sm, md, lg, xl
  className = '',
}) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-3xl',
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full border border-border bg-muted items-center justify-center font-bold text-muted-foreground ${sizes[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span>{getInitials(alt)}</span>
      )}
    </div>
  );
};

export default Avatar;
