import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export default function Textarea({ label, hint, className = '', id, ...props }: TextareaProps) {
  const textareaId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-navy-800">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
