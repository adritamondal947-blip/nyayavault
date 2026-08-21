export type IntegrityStatus = 'Verified' | 'Review Required' | 'Integrity Alert';

export type CaseStatus = 'Active' | 'Under Review' | 'Court Proceeding' | 'Closed';

export type ConfidentialityLevel = 'Public within organization' | 'Restricted' | 'Highly Confidential';

export type DocumentType =
  | 'FIR'
  | 'Police Report'
  | 'Witness Statement'
  | 'Charge Sheet'
  | 'Forensic Report'
  | 'Court Filing'
  | 'Evidence Record'
  | 'Legal Notice'
  | 'Judgment';

export type FileType = 'PDF' | 'DOCX' | 'JPG' | 'PNG';

export type UserRole =
  | 'Administrator'
  | 'Investigation Officer'
  | 'Forensic Officer'
  | 'Legal Officer'
  | 'Authorized Viewer';

export type AuditResult = 'Successful' | 'Denied' | 'Failed';

export type AuditAction =
  | 'Uploaded'
  | 'Viewed'
  | 'Downloaded'
  | 'Shared'
  | 'Permission Changed'
  | 'Integrity Verified'
  | 'Integrity Alert'
  | 'Login Failed'
  | 'Deleted';

export interface User {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  email: string;
}

export interface DocActivity {
  action: string;
  by: string;
  date: string;
}

export interface AccessEntry {
  name: string;
  role: UserRole;
  permission: 'View' | 'View & Download' | 'Manage';
}

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  fileType: FileType;
  caseId: string;
  caseTitle: string;
  uploadedBy: string;
  date: string;
  size: string;
  integrity: IntegrityStatus;
  confidentiality: ConfidentialityLevel;
  description: string;
  tags: string[];
  activity: DocActivity[];
  access: AccessEntry[];
}

export interface CaseItem {
  id: string;
  title: string;
  type: string;
  department: string;
  assignedOfficer: string;
  officerInitials: string;
  documentCount: number;
  lastUpdated: string;
  createdDate: string;
  status: CaseStatus;
  description: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  document?: string;
  caseId?: string;
  result: AuditResult;
}

export interface SecurityAlert {
  id: string;
  title: string;
  detail: string;
  document?: string;
  caseId?: string;
  detected: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'Requires Review' | 'Resolved' | 'Acknowledged';
}

export interface ActivityTimelineEntry {
  id: string;
  icon: 'upload' | 'view' | 'share' | 'permission' | 'verify';
  title: string;
  detail: string;
  time: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  sources?: string[];
  time: string;
}
