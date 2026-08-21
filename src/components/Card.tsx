import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({ children, hover, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-card ${hover ? 'transition-shadow duration-200 hover:shadow-card-hover' : ''} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
