import { useState } from 'react';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, Lock, KeyRound, FileWarning,
  CheckCircle2, Filter,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Select from '@/components/Select';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import { securityAlerts } from '@/data/mock';
import type { SecurityAlert } from '@/types';

const severityConfig = {
  critical: {
    icon: ShieldAlert,
    border: 'border-red-200',
    iconBg: 'bg-red-100 text-red-600',
    badge: 'red' as const,
    label: 'Critical',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
    badge: 'amber' as const,
    label: 'Warning',
  },
  info: {
    icon: ShieldCheck,
    border: 'border-slate-200',
    iconBg: 'bg-slate-100 text-slate-600',
    badge: 'slate' as const,
    label: 'Information',
  },
};

function categoryIcon(alert: SecurityAlert) {
  if (alert.title.toLowerCase().includes('integrity')) return FileWarning;
  if (alert.title.toLowerCase().includes('login')) return Lock;
  if (alert.title.toLowerCase().includes('permission')) return KeyRound;
  return ShieldAlert;
}

export default function SecurityAlerts() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Requires Review' | 'Resolved' | 'Acknowledged'>('all');
  const [alerts, setAlerts] = useState(securityAlerts);
  const [resolveTarget, setResolveTarget] = useState<string | null>(null);

  const filtered = alerts.filter(
    (a) =>
      (filter === 'all' || a.severity === filter) &&
      (statusFilter === 'all' || a.status === statusFilter),
  );

  const counts = {
    critical: alerts.filter((a) => a.severity === 'critical' && a.status === 'Requires Review').length,
    warning: alerts.filter((a) => a.severity === 'warning' && a.status === 'Requires Review').length,
    info: alerts.filter((a) => a.severity === 'info').length,
  };

  const resolveAlert = () => {
    if (!resolveTarget) return;
    setAlerts((prev) =>
      prev.map((a) => (a.id === resolveTarget ? { ...a, status: 'Resolved' } : a)),
    );
    setResolveTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Alerts"
        description="Monitor integrity alerts, access attempts and suspicious activity."
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 border-red-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <ShieldAlert size={22} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-navy-900">{counts.critical}</p>
            <p className="text-sm text-slate-500">Critical alerts</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-amber-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-navy-900">{counts.warning}</p>
            <p className="text-sm text-slate-500">Warnings</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-navy-900">{counts.info}</p>
            <p className="text-sm text-slate-500">Informational</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Filter size={16} /> Filter by
          </div>
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} aria-label="Severity">
              <option value="all">All severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Information</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} aria-label="Status">
              <option value="all">All statuses</option>
              <option value="Requires Review">Requires Review</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="No alerts to show"
            description="There are no security alerts matching your filters."
            icon={<ShieldCheck size={26} />}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((alert) => {
            const config = severityConfig[alert.severity];
            const CatIcon = categoryIcon(alert);
            return (
              <Card key={alert.id} padding="none" className={`border ${config.border}`}>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}>
                    <CatIcon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-navy-900">{alert.title}</h3>
                      <Badge tone={config.badge}>{config.label}</Badge>
                      {alert.status === 'Requires Review' && (
                        <Badge tone="red">Requires Review</Badge>
                      )}
                      {alert.status === 'Resolved' && (
                        <Badge tone="teal" icon={<CheckCircle2 size={13} />}>Resolved</Badge>
                      )}
                      {alert.status === 'Acknowledged' && (
                        <Badge tone="slate">Acknowledged</Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{alert.detail}</p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                      {alert.document && (
                        <span><span className="text-slate-400">Document: </span>{alert.document}</span>
                      )}
                      {alert.caseId && (
                        <span><span className="text-slate-400">Case: </span>{alert.caseId}</span>
                      )}
                      <span><span className="text-slate-400">Detected: </span>{alert.detected}</span>
                    </div>
                  </div>
                  {alert.status === 'Requires Review' && (
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setResolveTarget(alert.id)}
                      >
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!resolveTarget}
        onClose={() => setResolveTarget(null)}
        onConfirm={resolveAlert}
        title="Mark alert as resolved?"
        message="This will mark the security alert as resolved. The action will be recorded in the audit trail."
        confirmLabel="Mark Resolved"
      />
    </div>
  );
}
