import { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Search,
  UploadCloud,
  Eye,
  Download,
  Share2,
  Calendar,
  User as UserIcon,
  FolderKanban,
  CheckCircle2,
  Users,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Input from '@/components/Input';
import Select from '@/components/Select';
import IntegrityBadge from '@/components/IntegrityBadge';
import FileIcon from '@/components/FileIcon';
import CaseStatusBadge from '@/components/CaseStatusBadge';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import { cases, documents, auditEntries } from '@/data/mock';
import type { DocumentType } from '@/types';

const tabs = ['Overview', 'Documents', 'Timeline', 'People & Entities', 'Audit Trail'] as const;
type Tab = (typeof tabs)[number];

const docTypes: (DocumentType | 'All')[] = [
  'All', 'FIR', 'Police Report', 'Witness Statement', 'Charge Sheet',
  'Forensic Report', 'Court Filing', 'Evidence Record', 'Legal Notice', 'Judgment',
];

export default function CaseDetails() {
  const { route, navigate } = useApp();
  const id = route.name === 'case-details' ? route.id : '';
  const caseItem = cases.find((c) => c.id === id) || cases[0];
  const caseDocs = documents.filter((d) => d.caseId === caseItem.id);
  const caseAudit = auditEntries.filter((a) => a.caseId === caseItem.id);

  const [tab, setTab] = useState<Tab>('Overview');
  const [docQuery, setDocQuery] = useState('');
  const [docType, setDocType] = useState<DocumentType | 'All'>('All');
  const [shareOpen, setShareOpen] = useState(false);
  const [shareDoc, setShareDoc] = useState<string | null>(null);

  const filteredDocs = caseDocs.filter(
    (d) =>
      d.name.toLowerCase().includes(docQuery.toLowerCase()) &&
      (docType === 'All' || d.type === docType),
  );

  const openShare = (name: string) => {
    setShareDoc(name);
    setShareOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate({ name: 'cases' })}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy-700"
      >
        <ArrowLeft size={16} /> Back to Cases
      </button>

      {/* Header */}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-mono text-sm font-medium text-navy-600">{caseItem.id}</p>
              <CaseStatusBadge status={caseItem.status} />
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-navy-900">
              {caseItem.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{caseItem.type} · {caseItem.department}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={<UploadCloud size={18} />} onClick={() => navigate({ name: 'upload' })}>
              Upload
            </Button>
            <Button icon={<Share2 size={18} />} onClick={() => openShare(caseItem.id)}>
              Share Case
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
              <UserIcon size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Assigned Officer</p>
              <p className="text-sm font-medium text-navy-900">{caseItem.assignedOfficer}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Created</p>
              <p className="text-sm font-medium text-navy-900">{caseItem.createdDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Updated</p>
              <p className="text-sm font-medium text-navy-900">{caseItem.lastUpdated}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
              tab === t ? 'text-navy-800' : 'text-slate-500 hover:text-navy-700'
            }`}
          >
            {t}
            {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-navy-700" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h2 className="font-semibold text-navy-900">Case Description</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{caseItem.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">Documents</p>
                <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-navy-900">
                  <FileText size={16} className="text-navy-500" /> {caseItem.documentCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1.5"><CaseStatusBadge status={caseItem.status} /></p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Department</p>
                <p className="mt-1 text-sm font-medium text-navy-900">{caseItem.department}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Type</p>
                <p className="mt-1 text-sm font-medium text-navy-900">{caseItem.type}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-navy-900">Quick Stats</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-teal-600" /> Verified documents
                </span>
                <span className="text-sm font-semibold text-navy-900">
                  {caseDocs.filter((d) => d.integrity === 'Verified').length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <ShieldCheck size={16} className="text-amber-600" /> Needs review
                </span>
                <span className="text-sm font-semibold text-navy-900">
                  {caseDocs.filter((d) => d.integrity === 'Review Required').length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <ShieldCheck size={16} className="text-red-600" /> Integrity alerts
                </span>
                <span className="text-sm font-semibold text-navy-900">
                  {caseDocs.filter((d) => d.integrity === 'Integrity Alert').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'Documents' && (
        <div className="space-y-4">
          <Card>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="relative md:col-span-2">
                <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={docQuery}
                  onChange={(e) => setDocQuery(e.target.value)}
                  placeholder="Search documents in this case..."
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none"
                />
              </div>
              <Select value={docType} onChange={(e) => setDocType(e.target.value as DocumentType | 'All')} aria-label="Filter by type">
                {docTypes.map((t) => (
                  <option key={t} value={t}>{t === 'All' ? 'All types' : t}</option>
                ))}
              </Select>
            </div>
          </Card>

          <Card padding="none">
            {filteredDocs.length === 0 ? (
              <EmptyState title="No documents found" description="Try a different search or filter." icon={<FileText size={26} />} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3">Document</th>
                      <th className="hidden px-5 py-3 sm:table-cell">Type</th>
                      <th className="hidden px-5 py-3 md:table-cell">Uploaded By</th>
                      <th className="hidden px-5 py-3 sm:table-cell">Date</th>
                      <th className="px-5 py-3">Integrity</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                              <FileIcon fileType={doc.fileType} size={18} />
                            </div>
                            <button
                              onClick={() => navigate({ name: 'document-details', id: doc.id })}
                              className="truncate text-left font-medium text-navy-900 hover:text-navy-600"
                            >
                              {doc.name}
                            </button>
                          </div>
                        </td>
                        <td className="hidden px-5 py-3.5 text-slate-600 sm:table-cell">{doc.type}</td>
                        <td className="hidden px-5 py-3.5 text-slate-600 md:table-cell">{doc.uploadedBy}</td>
                        <td className="hidden px-5 py-3.5 text-slate-600 sm:table-cell">{doc.date}</td>
                        <td className="px-5 py-3.5"><IntegrityBadge status={doc.integrity} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => navigate({ name: 'document-details', id: doc.id })} className="rounded-md p-1.5 text-slate-400 hover:bg-navy-50 hover:text-navy-700" aria-label="Preview"><Eye size={16} /></button>
                            <button className="rounded-md p-1.5 text-slate-400 hover:bg-navy-50 hover:text-navy-700" aria-label="Download"><Download size={16} /></button>
                            <button onClick={() => openShare(doc.name)} className="rounded-md p-1.5 text-slate-400 hover:bg-navy-50 hover:text-navy-700" aria-label="Share"><Share2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === 'Timeline' && (
        <Card>
          <h2 className="font-semibold text-navy-900">Case Timeline</h2>
          <ol className="mt-5 space-y-5">
            {caseAudit.map((entry, i) => (
              <li key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-700">
                    {i + 1}
                  </div>
                  {i < caseAudit.length - 1 && <div className="my-1 h-full w-px flex-1 bg-slate-200" />}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-medium text-navy-900">{entry.action}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {entry.document && `${entry.document} · `}
                    {entry.user} · {entry.timestamp}
                  </p>
                  <Badge tone={entry.result === 'Successful' ? 'teal' : entry.result === 'Denied' ? 'amber' : 'red'} className="mt-1.5">
                    {entry.result}
                  </Badge>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {tab === 'People & Entities' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <h2 className="flex items-center gap-2 font-semibold text-navy-900"><Users size={18} className="text-navy-500" /> People</h2>
            <ul className="mt-4 space-y-3">
              {[
                { name: caseItem.assignedOfficer, role: 'Lead Investigator' },
                { name: 'R. Sen', role: 'Forensic Officer' },
                { name: 'M. Iyer', role: 'Legal Counsel' },
              ].map((p) => (
                <li key={p.name} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-sm font-semibold text-navy-700">
                    {p.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="flex items-center gap-2 font-semibold text-navy-900"><FolderKanban size={18} className="text-navy-500" /> Entities</h2>
            <ul className="mt-4 space-y-3">
              {['Sector 14 Parking Authority', 'Regional Forensic Lab', 'City Court — Bench 3'].map((e) => (
                <li key={e} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <FolderKanban size={18} />
                  </div>
                  <p className="text-sm font-medium text-navy-900">{e}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === 'Audit Trail' && (
        <Card padding="none">
          <div className="border-b border-slate-100 p-5">
            <h2 className="flex items-center gap-2 font-semibold text-navy-900"><ScrollText size={18} className="text-navy-500" /> Activity for this case</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Document</th>
                  <th className="px-5 py-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {caseAudit.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 text-slate-600">{entry.timestamp}</td>
                    <td className="px-5 py-3.5 font-medium text-navy-900">{entry.user}</td>
                    <td className="px-5 py-3.5 text-slate-600">{entry.action}</td>
                    <td className="px-5 py-3.5 text-slate-600">{entry.document || '—'}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={entry.result === 'Successful' ? 'teal' : entry.result === 'Denied' ? 'amber' : 'red'}>{entry.result}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Share modal */}
      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share with authorized users"
        description={shareDoc ? `Sharing: ${shareDoc}` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setShareOpen(false)}>Cancel</Button>
            <Button onClick={() => setShareOpen(false)}>Share</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Recipient email or employee ID" placeholder="e.g. r.sen@nyayavault.gov.in" />
          <Select label="Permission level" defaultValue="View">
            <option value="View">View only</option>
            <option value="View & Download">View & Download</option>
            <option value="Manage">Manage</option>
          </Select>
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            Only users with the appropriate role can be granted access. This action will be recorded in the audit trail.
          </div>
        </div>
      </Modal>
    </div>
  );
}
