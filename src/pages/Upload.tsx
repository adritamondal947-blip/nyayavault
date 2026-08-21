import { useState, useRef } from 'react';
import {
  UploadCloud, FileText, X, ShieldCheck, CheckCircle2, Info,
} from 'lucide-react';
import { useApp } from '@/store';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import FileIcon from '@/components/FileIcon';
import Tooltip from '@/components/Tooltip';
import { cases } from '@/data/mock';
import type { DocumentType, FileType, ConfidentialityLevel } from '@/types';

const docTypes: DocumentType[] = [
  'FIR', 'Police Report', 'Witness Statement', 'Charge Sheet',
  'Forensic Report', 'Court Filing', 'Evidence Record', 'Legal Notice', 'Judgment',
];
const confidentiality: ConfidentialityLevel[] = ['Public within organization', 'Restricted', 'Highly Confidential'];

interface SelectedFile {
  name: string;
  size: number;
  type: FileType;
}

const accepted = ['.pdf', '.docx', '.jpg', '.png'];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Upload() {
  const { navigate } = useApp();
  const [file, setFile] = useState<SelectedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const [docType, setDocType] = useState<DocumentType>('FIR');
  const [caseId, setCaseId] = useState(cases[0].id);
  const [conf, setConf] = useState<ConfidentialityLevel>('Restricted');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const detectType = (name: string): FileType => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'jpg' || ext === 'jpeg') return 'JPG';
    if (ext === 'png') return 'PNG';
    if (ext === 'docx') return 'DOCX';
    return 'PDF';
  };

  const handleFile = (f: File) => {
    setFile({ name: f.name, size: f.size, type: detectType(f.name) });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 1600);
  };

  if (uploaded) {
    return (
      <div className="mx-auto max-w-lg">
        <Card padding="lg" className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
            <CheckCircle2 size={32} className="text-teal-600" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-navy-900">Document uploaded securely</h1>
          <p className="mt-2 text-sm text-slate-500">
            The system has recorded the document's integrity fingerprint and logged the upload activity in the audit trail.
          </p>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <FileIcon fileType={file?.type || 'PDF'} size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-navy-900">{file?.name}</p>
                <p className="text-xs text-slate-500">{docType} · {caseId}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate({ name: 'documents' })}>Go to Documents</Button>
            <Button variant="outline" onClick={() => { setFile(null); setUploaded(false); setDescription(''); setTags(''); }}>
              Upload Another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Upload Document" description="Securely add a new document to an authorized case." />

      <form onSubmit={submit} className="space-y-6">
        <Card>
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
                dragging ? 'border-navy-500 bg-navy-50' : 'border-slate-300 hover:border-navy-400 hover:bg-slate-50'
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 text-navy-600">
                <UploadCloud size={30} />
              </div>
              <p className="mt-4 text-base font-semibold text-navy-900">Drag & drop your document here</p>
              <p className="mt-1 text-sm text-slate-500">or choose a file</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {accepted.map((a) => (
                  <span key={a} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 uppercase">{a}</span>
                ))}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                  <FileIcon fileType={file.type} size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy-900">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatSize(file.size)} · {file.type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-navy-700"
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </Card>

        {file && (
          <Card className="animate-fade-in space-y-5">
            <h2 className="font-semibold text-navy-900">Document Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Document type" value={docType} onChange={(e) => setDocType(e.target.value as DocumentType)}>
                {docTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
              <Select label="Case ID" value={caseId} onChange={(e) => setCaseId(e.target.value)}>
                {cases.map((c) => <option key={c.id} value={c.id}>{c.id} — {c.title}</option>)}
              </Select>
              <Select label="Confidentiality level" value={conf} onChange={(e) => setConf(e.target.value as ConfidentialityLevel)}>
                {confidentiality.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Input label="Tags" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. evidence, cctv, witness" hint="Separate tags with commas" />
            </div>
            <Textarea
              label="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Briefly describe what this document contains..."
            />

            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-teal-600" />
              <p className="text-xs leading-relaxed text-slate-600">
                After upload, the system records the document's integrity fingerprint and logs the upload activity.
                This helps detect any later changes to the file.
              </p>
            </div>

            <Button type="submit" size="lg" block disabled={uploading} icon={uploading ? undefined : <UploadCloud size={18} />}>
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Uploading securely...
                </span>
              ) : (
                'Securely Upload Document'
              )}
            </Button>
          </Card>
        )}
      </form>

      <div className="flex items-start gap-3 rounded-lg bg-navy-50 p-4 text-sm text-navy-700">
        <Info size={18} className="mt-0.5 shrink-0 text-navy-500" />
        <p>
          NyayaVault records a cryptographic fingerprint of each document at upload and verifies it on every access.
          This helps detect unauthorized changes — it does not make a document completely tamper-proof.
          <Tooltip content="An integrity fingerprint is a unique code computed from the file's contents. If even one byte changes, the fingerprint changes, signalling that the file was modified." />
        </p>
      </div>
    </div>
  );
}
