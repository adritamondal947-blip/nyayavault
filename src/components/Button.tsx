import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-navy-700 text-white hover:bg-navy-800 active:bg-navy-900 shadow-sm focus-visible:ring-navy-500',
  secondary:
    'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm focus-visible:ring-teal-500',
  outline:
    'border border-slate-300 bg-white text-navy-800 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-navy-500',
  ghost:
    'text-navy-700 hover:bg-navy-50 focus-visible:ring-navy-500',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm focus-visible:ring-red-500',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  block,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap ${variants[variant]} ${sizes[size]} ${block ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
