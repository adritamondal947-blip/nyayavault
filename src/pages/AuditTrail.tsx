import { useState } from 'react';
import { ScrollText, Search, List, GitBranch, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Select from '@/components/Select';
import EmptyState from '@/components/EmptyState';
import { auditEntries, users } from '@/data/mock';
import type { AuditAction, AuditResult } from '@/types';

const actions: (AuditAction | 'All')[] = [
  'All', 'Uploaded', 'Viewed', 'Downloaded', 'Shared', 'Permission Changed',
  'Integrity Verified', 'Integrity Alert', 'Login Failed',
];
const results: (AuditResult | 'All')[] = ['All', 'Successful', 'Denied', 'Failed'];

const actionIcon = (action: AuditAction) => {
  switch (action) {
    case 'Uploaded': return 'bg-navy-100 text-navy-600';
    case 'Viewed': return 'bg-blue-100 text-blue-600';
    case 'Downloaded': return 'bg-blue-100 text-blue-600';
    case 'Shared': return 'bg-teal-100 text-teal-600';
    case 'Permission Changed': return 'bg-amber-100 text-amber-600';
    case 'Integrity Verified': return 'bg-teal-100 text-teal-600';
    case 'Integrity Alert': return 'bg-red-100 text-red-600';
    case 'Login Failed': return 'bg-red-100 text-red-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const resultBadge = (r: AuditResult) => {
  if (r === 'Successful') return <Badge tone="teal" icon={<CheckCircle2 size={13} />}>Successful</Badge>;
  if (r === 'Denied') return <Badge tone="amber" icon={<AlertTriangle size={13} />}>Denied</Badge>;
  return <Badge tone="red" icon={<XCircle size={13} />}>Failed</Badge>;
};

export default function AuditTrail() {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState('All');
  const [action, setAction] = useState<AuditAction | 'All'>('All');
  const [result, setResult] = useState<AuditResult | 'All'>('All');
  const [view, setView] = useState<'table' | 'timeline'>('table');

  const filtered = auditEntries.filter((e) => {
    const q = query.toLowerCase();
    const matchesQuery =
      e.user.toLowerCase().includes(q) ||
      (e.document?.toLowerCase().includes(q) || false) ||
      (e.caseId?.toLowerCase().includes(q) || false) ||
      e.action.toLowerCase().includes(q);
    const matchesUser = user === 'All' || e.user === user;
    const matchesAction = action === 'All' || e.action === action;
    const matchesResult = result === 'All' || e.result === result;
    return matchesQuery && matchesUser && matchesAction && matchesResult;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Trail"
        description="Track important activity across documents and cases."
        actions={
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === 'table' ? 'bg-navy-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <List size={15} /> Table
            </button>
            <button
              onClick={() => setView('timeline')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === 'timeline' ? 'bg-navy-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <GitBranch size={15} /> Timeline
            </button>
          </div>
        }
      />

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none"
            />
          </div>
          <Select value={user} onChange={(e) => setUser(e.target.value)} aria-label="User">
            <option value="All">All users</option>
            {users.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
            <option value="System">System</option>
            <option value="unknown">unknown</option>
          </Select>
          <Select value={action} onChange={(e) => setAction(e.target.value as AuditAction | 'All')} aria-label="Action">
            {actions.map((a) => <option key={a} value={a}>{a === 'All' ? 'All actions' : a}</option>)}
          </Select>
          <Select value={result} onChange={(e) => setResult(e.target.value as AuditResult | 'All')} aria-label="Result">
            {results.map((r) => <option key={r} value={r}>{r === 'All' ? 'All results' : r}</option>)}
          </Select>
        </div>
      </Card>

      <p className="text-sm text-slate-500">{filtered.length} entries</p>

      {filtered.length === 0 ? (
        <Card><EmptyState title="No audit entries match your filters" icon={<ScrollText size={26} />} /></Card>
      ) : view === 'table' ? (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="hidden px-5 py-3 md:table-cell">Document</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Case</th>
                  <th className="px-5 py-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">{entry.timestamp}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                          {entry.user === 'System' ? 'SY' : entry.user === 'unknown' ? '?' : entry.user.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-medium text-navy-900">{entry.user}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${actionIcon(entry.action)}`}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-slate-600 md:table-cell">{entry.document || '—'}</td>
                    <td className="hidden px-5 py-3.5 font-mono text-xs text-navy-600 lg:table-cell">{entry.caseId || '—'}</td>
                    <td className="px-5 py-3.5">{resultBadge(entry.result)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <ol className="relative space-y-1">
            {filtered.map((entry, i) => (
              <li key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${actionIcon(entry.action)}`}>
                    {i + 1}
                  </div>
                  {i < filtered.length - 1 && <div className="my-1 w-px flex-1 bg-slate-200" />}
                </div>
                <div className="pb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-navy-900">{entry.action}</p>
                    {resultBadge(entry.result)}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {entry.user} · {entry.timestamp}
                  </p>
                  {(entry.document || entry.caseId) && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {entry.document && <span>{entry.document} · </span>}
                      {entry.caseId}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
