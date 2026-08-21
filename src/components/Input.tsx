import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  isPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, isPassword, className = '', type = 'text', id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const inputId = id || props.name;
    const effectiveType = isPassword ? (show ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-navy-800">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none ${
              icon ? 'pl-10' : ''
            } ${isPassword ? 'pr-10' : ''} ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-700"
              aria-label={show ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
