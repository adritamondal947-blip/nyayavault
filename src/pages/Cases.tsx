import { useState } from 'react';
import { Search, Plus, FolderKanban, FileText, ArrowUpDown, ChevronRight } from 'lucide-react';
import { useApp } from '@/store';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Select from '@/components/Select';
import CaseStatusBadge from '@/components/CaseStatusBadge';
import EmptyState from '@/components/EmptyState';
import { cases } from '@/data/mock';
import type { CaseStatus } from '@/types';

const statuses: (CaseStatus | 'All')[] = ['All', 'Active', 'Under Review', 'Court Proceeding', 'Closed'];
const departments = ['All', 'Investigation', 'Legal', 'Forensics'];

export default function Cases() {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<CaseStatus | 'All'>('All');
  const [department, setDepartment] = useState('All');
  const [sort, setSort] = useState('recent');

  const filtered = cases
    .filter((c) => {
      const matchesQuery =
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.assignedOfficer.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || c.status === status;
      const matchesDept = department === 'All' || c.department === department;
      return matchesQuery && matchesStatus && matchesDept;
    })
    .sort((a, b) => {
      if (sort === 'recent') return b.lastUpdated.localeCompare(a.lastUpdated);
      if (sort === 'oldest') return a.lastUpdated.localeCompare(b.lastUpdated);
      if (sort === 'docs') return b.documentCount - a.documentCount;
      return 0;
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cases"
        description="Manage investigation and legal cases in one place."
        actions={
          <Button icon={<Plus size={18} />} onClick={() => navigate({ name: 'upload' })}>
            Create New Case
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by case title, ID or officer..."
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none"
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value as CaseStatus | 'All')} aria-label="Filter by status">
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All statuses' : s}
              </option>
            ))}
          </Select>
          <Select value={department} onChange={(e) => setDepartment(e.target.value)} aria-label="Filter by department">
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All departments' : d}
              </option>
            ))}
          </Select>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {filtered.length} case{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-slate-400" />
            <Select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 w-auto py-0 text-sm" aria-label="Sort">
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest first</option>
              <option value="docs">Most documents</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Cases grid */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="No cases match your filters"
            description="Try adjusting your search or filter criteria."
            icon={<FolderKanban size={26} />}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <Card
              key={c.id}
              hover
              padding="none"
              className="cursor-pointer"
              onClick={() => navigate({ name: 'case-details', id: c.id })}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-navy-500">{c.id}</p>
                    <h3 className="mt-1 truncate font-semibold text-navy-900">{c.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{c.type}</p>
                  </div>
                  <CaseStatusBadge status={c.status} />
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {c.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-100 text-[10px] font-semibold text-navy-700">
                      {c.officerInitials}
                    </div>
                    {c.assignedOfficer}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText size={14} /> {c.documentCount}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  {c.lastUpdated}
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
