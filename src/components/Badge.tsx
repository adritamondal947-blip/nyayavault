import type { ReactNode } from 'react';

type Tone = 'navy' | 'teal' | 'amber' | 'red' | 'slate' | 'blue';

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  navy: 'bg-navy-100 text-navy-700',
  teal: 'bg-teal-100 text-teal-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  slate: 'bg-slate-100 text-slate-600',
  blue: 'bg-blue-100 text-blue-700',
};

export default function Badge({ tone = 'slate', children, icon, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
