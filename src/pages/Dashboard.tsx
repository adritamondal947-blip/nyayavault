import {
  FolderKanban,
  FileText,
  CalendarPlus,
  ShieldAlert,
  UploadCloud,
  Search,
  Eye,
  Share2,
  KeyRound,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import IntegrityBadge from '@/components/IntegrityBadge';
import FileIcon from '@/components/FileIcon';
import { documents, stats, dashboardTimeline } from '@/data/mock';
import type { ActivityTimelineEntry } from '@/types';

const timelineIcons = {
  upload: UploadCloud,
  view: Eye,
  share: Share2,
  permission: KeyRound,
  verify: CheckCircle2,
};

const timelineColors = {
  upload: 'bg-navy-100 text-navy-600',
  view: 'bg-blue-100 text-blue-600',
  share: 'bg-teal-100 text-teal-600',
  permission: 'bg-amber-100 text-amber-600',
  verify: 'bg-teal-100 text-teal-600',
};

export default function Dashboard() {
  const { user, navigate } = useApp();
  const recentDocs = documents.slice(0, 4);

  const statCards = [
    { label: 'Active Cases', value: stats.activeCases, icon: FolderKanban, tone: 'navy' },
    { label: 'Total Documents', value: stats.totalDocuments, icon: FileText, tone: 'blue' },
    { label: 'Added This Week', value: stats.documentsThisWeek, icon: CalendarPlus, tone: 'teal' },
    { label: 'Security Alerts', value: stats.securityAlerts, icon: ShieldAlert, tone: 'red' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Good morning,</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-navy-900">
            Officer {user.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here's an overview of your cases and documents.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          const toneClasses: Record<string, string> = {
            navy: 'bg-navy-50 text-navy-600',
            blue: 'bg-blue-50 text-blue-600',
            teal: 'bg-teal-50 text-teal-600',
            red: 'bg-red-50 text-red-600',
          };
          return (
            <Card key={s.label} hover className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneClasses[s.tone]}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-navy-900">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <Card padding="lg" className="bg-gradient-to-br from-navy-800 to-navy-900 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Quick actions</h2>
            <p className="mt-1 text-sm text-navy-200">
              Get started with common tasks in your workspace.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="secondary"
              icon={<UploadCloud size={18} />}
              onClick={() => navigate({ name: 'upload' })}
            >
              Upload Document
            </Button>
            <button
              onClick={() => navigate({ name: 'cases' })}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-medium text-white hover:bg-white/10"
            >
              <FolderKanban size={18} /> Create Case
            </button>
            <button
              onClick={() => navigate({ name: 'documents' })}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-medium text-white hover:bg-white/10"
            >
              <Search size={18} /> Search Documents
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent documents */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-semibold text-navy-900">Recent Documents</h2>
              <button
                onClick={() => navigate({ name: 'documents' })}
                className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:text-navy-800"
              >
                View all <ArrowRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3 font-semibold">Document</th>
                    <th className="px-5 py-3 font-semibold">Case</th>
                    <th className="hidden px-5 py-3 font-semibold md:table-cell">Uploaded By</th>
                    <th className="hidden px-5 py-3 font-semibold sm:table-cell">Date</th>
                    <th className="px-5 py-3 font-semibold">Integrity</th>
                    <th className="px-5 py-3 text-right font-semibold">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="cursor-pointer transition-colors hover:bg-slate-50"
                      onClick={() => navigate({ name: 'document-details', id: doc.id })}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                            <FileIcon fileType={doc.fileType} size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-navy-900">{doc.name}</p>
                            <p className="truncate text-xs text-slate-500">{doc.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs text-navy-600">{doc.caseId}</p>
                      </td>
                      <td className="hidden px-5 py-3.5 text-slate-600 md:table-cell">{doc.uploadedBy}</td>
                      <td className="hidden px-5 py-3.5 text-slate-600 sm:table-cell">{doc.date}</td>
                      <td className="px-5 py-3.5">
                        <IntegrityBadge status={doc.integrity} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({ name: 'document-details', id: doc.id });
                          }}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-navy-50 hover:text-navy-700"
                          aria-label="View document"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <div>
          <Card padding="none">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-semibold text-navy-900">Recent Activity</h2>
              <p className="mt-0.5 text-xs text-slate-500">Across your workspace today</p>
            </div>
            <div className="p-5">
              <ol className="relative space-y-5">
                {dashboardTimeline.map((item: ActivityTimelineEntry) => {
                  const Icon = timelineIcons[item.icon];
                  return (
                    <li key={item.id} className="flex gap-3.5">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${timelineColors[item.icon]}`}>
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-navy-900">{item.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
