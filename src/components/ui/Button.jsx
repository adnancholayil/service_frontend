'use client';
import React, { useRef } from 'react';

export const Button = React.forwardRef(({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const btnRef = useRef(null);
  const resolvedRef = ref || btnRef;

  // Ripple effect
  const handleClick = (e) => {
    const btn = resolvedRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    }
    onClick?.(e);
  };

  const base = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none ripple-container overflow-hidden active:scale-[0.97]';

  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/20 focus-visible:ring-brand',
    secondary: 'bg-muted text-foreground hover:bg-border focus-visible:ring-border',
    outline: 'border-2 border-border text-foreground hover:bg-muted hover:border-border bg-transparent focus-visible:ring-border',
    accent: 'bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/20 focus-visible:ring-accent',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm focus-visible:ring-red-500',
    ghost: 'hover:bg-muted text-foreground focus-visible:ring-border',
    brand_outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white focus-visible:ring-brand',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs gap-1.5',
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3',
    icon: 'p-2.5',
  };

  return (
    <button
      ref={resolvedRef}
      type={type}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading…</span>
        </>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
