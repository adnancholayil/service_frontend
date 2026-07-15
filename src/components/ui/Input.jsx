import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({
  className = '',
  label,
  error,
  type = 'text',
  id,
  icon: Icon,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold text-muted-foreground uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <input
          ref={ref}
          type={inputType}
          id={id}
          className={`
            w-full bg-muted/40 border border-border rounded-xl text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:bg-card focus:border-brand focus:ring-2 focus:ring-brand/20
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            text-sm py-2.5
            ${Icon ? 'pl-10 pr-4' : 'px-4'}
            ${isPassword ? 'pr-11' : ''}
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium">{error.message || error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
