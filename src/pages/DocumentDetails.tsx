import { useState } from 'react';
import {
  ArrowLeft, Eye, Download, Share2, ShieldCheck, ChevronDown, ChevronUp,
  CheckCircle2, Upload, FileText, Lock, Users, Calendar, User as UserIcon, HardDrive,
} from 'lucide-react';
import { useApp } from '@/store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import IntegrityBadge from '@/components/IntegrityBadge';
import FileIcon from '@/components/FileIcon';
import Modal from '@/components/Modal';
import Tooltip from '@/components/Tooltip';
import { documents } from '@/data/mock';
import type { ConfidentialityLevel } from '@/types';

const confidentialityTone: Record<ConfidentialityLevel, 'teal' | 'amber' | 'red'> = {
  'Public within organization': 'teal',
  Restricted: 'amber',
  'Highly Confidential': 'red',
};

export default function DocumentDetails() {
  const { route, navigate } = useApp();
  const id = route.name === 'document-details' ? route.id : '';
  const doc = documents.find((d) => d.id === id) || documents[0];

  const [shareOpen, setShareOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<'idle' | 'running' | 'done'>('idle');
  const [showTechnical, setShowTechnical] = useState(false);

  const runVerify = () => {
    setVerifying(true);
    setVerifyResult('running');
    setTimeout(() => {
      setVerifyResult('done');
      setVerifying(false);
    }, 1400);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate({ name: 'documents' })}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy-700"
      >
        <ArrowLeft size={16} /> Back to Documents
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Preview */}
        <div className="lg:col-span-2">
          <Card padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <FileIcon fileType={doc.fileType} size={20} />
                </div>
                <div>
                  <p className="font-medium text-navy-900">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.fileType} · {doc.size}</p>
                </div>
              </div>
              <IntegrityBadge status={doc.integrity} size="md" />
            </div>

            {/* Mock preview */}
            <div className="flex min-h-[420px] items-center justify-center bg-slate-50 p-8">
              <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-navy-500" />
                    <span className="text-sm font-medium text-navy-800">{doc.type}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-400">{doc.caseId}</span>
                </div>
                <div className="space-y-2.5">
                  <div className="h-2.5 w-full rounded bg-slate-100" />
                  <div className="h-2.5 w-11/12 rounded bg-slate-100" />
                  <div className="h-2.5 w-10/12 rounded bg-slate-100" />
                  <div className="h-2.5 w-full rounded bg-slate-100" />
                  <div className="h-2.5 w-9/12 rounded bg-slate-100" />
                  <div className="h-2.5 w-11/12 rounded bg-slate-100" />
                  <div className="h-2.5 w-8/12 rounded bg-slate-100" />
                </div>
                <p className="mt-6 text-center text-xs text-slate-400">Document preview — content redacted in this view</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" icon={<Eye size={16} />} block>View</Button>
              <Button variant="outline" icon={<Download size={16} />} block>Download</Button>
              <Button variant="outline" icon={<Share2 size={16} />} block onClick={() => setShareOpen(true)}>Share</Button>
              <Button icon={<ShieldCheck size={16} />} block onClick={runVerify} disabled={verifying}>
                {verifying ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </Card>

          {/* Info */}
          <Card>
            <h2 className="font-semibold text-navy-900">Document Information</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                { icon: FileText, label: 'Document Type', value: doc.type },
                { icon: FileText, label: 'Case ID', value: doc.caseId, mono: true },
                { icon: UserIcon, label: 'Uploaded By', value: doc.uploadedBy },
                { icon: Calendar, label: 'Upload Date', value: doc.date },
                { icon: HardDrive, label: 'File Size', value: doc.size },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center justify-between gap-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <Icon size={15} className="text-slate-400" /> {row.label}
                    </dt>
                    <dd className={`font-medium text-navy-900 ${row.mono ? 'font-mono text-xs' : ''}`}>{row.value}</dd>
                  </div>
                );
              })}
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-slate-500">
                  <Lock size={15} className="text-slate-400" /> Confidentiality
                </dt>
                <dd><Badge tone={confidentialityTone[doc.confidentiality]}>{doc.confidentiality}</Badge></dd>
              </div>
            </dl>
            {doc.tags.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {doc.tags.map((t) => (
                    <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">#{t}</span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Security */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-navy-900">Document Integrity</h2>
              <Tooltip content="Integrity verification checks whether the document matches the fingerprint recorded when it was first uploaded." />
            </div>

            {verifyResult === 'done' ? (
              <div className="mt-4 flex items-start gap-3 rounded-lg bg-teal-50 p-4">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-teal-600" />
                <div>
                  <p className="text-sm font-medium text-teal-800">Verified</p>
                  <p className="mt-0.5 text-xs text-teal-700">Document matches its original integrity fingerprint.</p>
                </div>
              </div>
            ) : verifyResult === 'running' ? (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-navy-50 p-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-300 border-t-navy-700" />
                <p className="text-sm text-navy-700">Verifying document integrity...</p>
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-slate-200 p-4">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-teal-600" />
                <div>
                  <p className="text-sm font-medium text-navy-900">{doc.integrity === 'Verified' ? 'Verified' : 'Needs attention'}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {doc.integrity === 'Verified'
                      ? 'Document matches its original integrity fingerprint.'
                      : 'This document requires manual review before use as evidence.'}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowTechnical((s) => !s)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-navy-600 hover:text-navy-800"
            >
              {showTechnical ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Technical Details
            </button>
            {showTechnical && (
              <div className="mt-2 space-y-1.5 rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600">
                <p>Algorithm: SHA-256</p>
                <p>Fingerprint: a3f5…c91d (recorded at upload)</p>
                <p>Last checked: 21 Aug 2026, 10:31</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Bottom: activity + access */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-navy-900">Document Activity</h2>
          <ol className="mt-4 space-y-4">
            {doc.activity.map((a, i) => (
              <li key={i} className="flex gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-100 text-navy-600">
                  {a.action === 'Uploaded' ? <Upload size={16} /> : a.action === 'Viewed' ? <Eye size={16} /> : a.action === 'Shared' ? <Share2 size={16} /> : <ShieldCheck size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-900">{a.action}</p>
                  <p className="text-xs text-slate-500">{a.by} · {a.date}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 font-semibold text-navy-900">
            <Users size={18} className="text-navy-500" /> Authorized Access
          </h2>
          <ul className="mt-4 space-y-3">
            {doc.access.map((a) => (
              <li key={a.name} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-700">
                    {a.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">{a.name}</p>
                    <p className="text-xs text-slate-500">{a.role}</p>
                  </div>
                </div>
                <Badge tone="slate">{a.permission}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Share modal */}
      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share with authorized users"
        description={doc.name}
        footer={
          <>
            <Button variant="outline" onClick={() => setShareOpen(false)}>Cancel</Button>
            <Button onClick={() => setShareOpen(false)}>Share</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-800">Recipient email or employee ID</label>
            <input className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none" placeholder="e.g. r.sen@nyayavault.gov.in" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Permission level</label>
            <select className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none" defaultValue="View">
              <option value="View">View only</option>
              <option value="View & Download">View & Download</option>
            </select>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            This action will be recorded in the audit trail.
          </div>
        </div>
      </Modal>
    </div>
  );
}
