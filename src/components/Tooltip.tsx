import { useState } from 'react';
import type { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface Props {
  content: string;
  children?: ReactNode;
}

export default function Tooltip({ content, children }: Props) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children || (
        <button
          type="button"
          className="text-slate-400 hover:text-navy-600"
          aria-label="Learn more"
        >
          <Info size={14} />
        </button>
      )}
      {show && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-56 -translate-x-1/2 rounded-lg bg-navy-900 px-3 py-2 text-xs font-normal leading-relaxed text-white shadow-lg">
          {content}
        </span>
      )}
    </span>
  );
}
