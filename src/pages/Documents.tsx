import { useState } from 'react';
import {
  Search, Eye, MoreVertical, Download, Share2, ShieldCheck, FileText, ChevronDown,
} from 'lucide-react';
import { useApp } from '@/store';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Select from '@/components/Select';
import IntegrityBadge from '@/components/IntegrityBadge';
import FileIcon from '@/components/FileIcon';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import { documents, cases } from '@/data/mock';
import type { DocumentType, IntegrityStatus, ConfidentialityLevel } from '@/types';

const docTypes: (DocumentType | 'All')[] = [
  'All', 'FIR', 'Police Report', 'Witness Statement', 'Charge Sheet',
  'Forensic Report', 'Court Filing', 'Evidence Record', 'Legal Notice', 'Judgment',
];
const integrityOptions: (IntegrityStatus | 'All')[] = ['All', 'Verified', 'Review Required', 'Integrity Alert'];
const confidentialityOptions: (ConfidentialityLevel | 'All')[] = [
  'All', 'Public within organization', 'Restricted', 'Highly Confidential',
];

function MoreMenu({ onView, onShare }: { onView: () => void; onShare: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="rounded-md p-1.5 text-slate-400 hover:bg-navy-50 hover:text-navy-700"
        aria-label="More actions"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpen(false); }} aria-hidden />
          <div className="absolute right-0 top-full z-20 mt-1 w-44 animate-fade-in rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            <button onClick={(e) => { e.stopPropagation(); onView(); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Eye size={15} /> View details
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Download size={15} /> Download
            </button>
            <button onClick={(e) => { e.stopPropagation(); onShare(); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Share2 size={15} /> Share
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <ShieldCheck size={15} /> Verify integrity
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Documents() {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<DocumentType | 'All'>('All');
  const [caseFilter, setCaseFilter] = useState('All');
  const [integrity, setIntegrity] = useState<IntegrityStatus | 'All'>('All');
  const [confidentiality, setConfidentiality] = useState<ConfidentialityLevel | 'All'>('All');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shareDoc, setShareDoc] = useState<string | null>(null);

  const filtered = documents.filter((d) => {
    const q = query.toLowerCase();
    const matchesQuery =
      d.name.toLowerCase().includes(q) ||
      d.caseId.toLowerCase().includes(q) ||
      d.uploadedBy.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.tags.some((t) => t.includes(q));
    return (
      matchesQuery &&
      (type === 'All' || d.type === type) &&
      (caseFilter === 'All' || d.caseId === caseFilter) &&
      (integrity === 'All' || d.integrity === integrity) &&
      (confidentiality === 'All' || d.confidentiality === confidentiality)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Find, manage and securely access authorized documents."
        actions={
          <Button icon={<FileText size={18} />} onClick={() => navigate({ name: 'upload' })}>
            Upload Document
          </Button>
        }
      />

      {/* Search */}
      <Card>
        <div className="relative">
          <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by document name, case ID, person, keyword or description..."
            className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-12 pr-4 text-sm placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none"
          />
        </div>

        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:text-navy-800"
        >
          Filters {filtersOpen ? <ChevronDown size={16} className="rotate-180" /> : <ChevronDown size={16} />}
        </button>

        {filtersOpen && (
          <div className="mt-3 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={type} onChange={(e) => setType(e.target.value as DocumentType | 'All')} aria-label="Document type">
              {docTypes.map((t) => <option key={t} value={t}>{t === 'All' ? 'All types' : t}</option>)}
            </Select>
            <Select value={caseFilter} onChange={(e) => setCaseFilter(e.target.value)} aria-label="Case">
              <option value="All">All cases</option>
              {cases.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}
            </Select>
            <Select value={integrity} onChange={(e) => setIntegrity(e.target.value as IntegrityStatus | 'All')} aria-label="Integrity">
              {integrityOptions.map((i) => <option key={i} value={i}>{i === 'All' ? 'All integrity' : i}</option>)}
            </Select>
            <Select value={confidentiality} onChange={(e) => setConfidentiality(e.target.value as ConfidentialityLevel | 'All')} aria-label="Confidentiality">
              {confidentialityOptions.map((c) => <option key={c} value={c}>{c === 'All' ? 'All confidentiality' : c}</option>)}
            </Select>
          </div>
        )}
      </Card>

      <p className="text-sm text-slate-500">{filtered.length} document{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <Card padding="none">
        {filtered.length === 0 ? (
          <EmptyState
            title="No documents found"
            description="Try adjusting your search or filters."
            icon={<FileText size={26} />}
            action={<Button variant="outline" onClick={() => { setQuery(''); setType('All'); setCaseFilter('All'); setIntegrity('All'); setConfidentiality('All'); }}>Clear filters</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3">Document</th>
                  <th className="hidden px-5 py-3 md:table-cell">Type</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Case</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Uploaded by</th>
                  <th className="hidden px-5 py-3 sm:table-cell">Date</th>
                  <th className="px-5 py-3">Integrity</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate({ name: 'document-details', id: doc.id })}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                          <FileIcon fileType={doc.fileType} size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-navy-900">{doc.name}</p>
                          <p className="truncate text-xs text-slate-500">{doc.confidentiality}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-slate-600 md:table-cell">{doc.type}</td>
                    <td className="hidden px-5 py-3.5 font-mono text-xs text-navy-600 lg:table-cell">{doc.caseId}</td>
                    <td className="hidden px-5 py-3.5 text-slate-600 lg:table-cell">{doc.uploadedBy}</td>
                    <td className="hidden px-5 py-3.5 text-slate-600 sm:table-cell">{doc.date}</td>
                    <td className="px-5 py-3.5"><IntegrityBadge status={doc.integrity} /></td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate({ name: 'document-details', id: doc.id })} className="rounded-md p-1.5 text-slate-400 hover:bg-navy-50 hover:text-navy-700" aria-label="View">
                          <Eye size={16} />
                        </button>
                        <MoreMenu onView={() => navigate({ name: 'document-details', id: doc.id })} onShare={() => setShareDoc(doc.name)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={!!shareDoc}
        onClose={() => setShareDoc(null)}
        title="Share with authorized users"
        description={shareDoc ? `Sharing: ${shareDoc}` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setShareDoc(null)}>Cancel</Button>
            <Button onClick={() => setShareDoc(null)}>Share</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-800">Recipient email or employee ID</label>
            <input className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none" placeholder="e.g. r.sen@nyayavault.gov.in" />
          </div>
          <Select label="Permission level" defaultValue="View">
            <option value="View">View only</option>
            <option value="View & Download">View & Download</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
