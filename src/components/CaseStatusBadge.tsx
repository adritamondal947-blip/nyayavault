import type { CaseStatus } from '@/types';
import Badge from './Badge';

interface Props {
  status: CaseStatus;
}

export default function CaseStatusBadge({ status }: Props) {
  switch (status) {
    case 'Active':
      return <Badge tone="teal">{status}</Badge>;
    case 'Under Review':
      return <Badge tone="amber">{status}</Badge>;
    case 'Court Proceeding':
      return <Badge tone="blue">{status}</Badge>;
    case 'Closed':
      return <Badge tone="slate">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}
