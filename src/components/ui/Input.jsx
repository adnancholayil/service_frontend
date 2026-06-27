import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({
  className = '',
  label,
  error,
  type = 'text',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          id={id}
          className={`w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50 disabled:bg-muted ${isPassword ? 'pr-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            title={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error.message || error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
