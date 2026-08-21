import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { IntegrityStatus } from '@/types';
import Badge from './Badge';

interface Props {
  status: IntegrityStatus;
  size?: 'sm' | 'md';
}

export default function IntegrityBadge({ status, size = 'sm' }: Props) {
  if (status === 'Verified') {
    return (
      <Badge tone="teal" icon={<CheckCircle2 size={size === 'sm' ? 13 : 16} />}>
        Verified
      </Badge>
    );
  }
  if (status === 'Review Required') {
    return (
      <Badge tone="amber" icon={<AlertTriangle size={size === 'sm' ? 13 : 16} />}>
        Review Required
      </Badge>
    );
  }
  return (
    <Badge tone="red" icon={<ShieldAlert size={size === 'sm' ? 13 : 16} />}>
      Integrity Alert
    </Badge>
  );
}
