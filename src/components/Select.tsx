import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export default function Select({ label, hint, className = '', id, children, ...props }: SelectProps) {
  const selectId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-navy-800">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy-900 transition-colors focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
