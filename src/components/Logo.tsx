import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark';
  theme?: 'light' | 'dark';
}

const sizes = {
  sm: { mark: 28, title: 'text-base', gap: 'gap-2' },
  md: { mark: 36, title: 'text-lg', gap: 'gap-2.5' },
  lg: { mark: 48, title: 'text-2xl', gap: 'gap-3' },
};

export default function Logo({ size = 'md', variant = 'full', theme = 'light' }: LogoProps) {
  const s = sizes[size];
  const titleColor = theme === 'dark' ? 'text-white' : 'text-navy-800';
  const subColor = theme === 'dark' ? 'text-navy-200' : 'text-navy-500';

  return (
    <div className={`flex items-center ${s.gap}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-navy-800 shadow-sm"
        style={{ width: s.mark, height: s.mark }}
      >
        <ShieldCheck
          className="text-teal-400"
          style={{ width: s.mark * 0.55, height: s.mark * 0.55 }}
          strokeWidth={2.2}
        />
      </div>
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span className={`font-semibold tracking-tight ${s.title} ${titleColor}`}>
            Nyaya<span className="text-teal-500">Vault</span>
          </span>
          {size === 'lg' && (
            <span className={`mt-1 text-xs font-normal ${subColor}`}>
              Secure documents. Trusted evidence.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
