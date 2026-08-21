import { FileText, FileImage, FileType2 } from 'lucide-react';
import type { FileType } from '@/types';

interface Props {
  fileType: FileType;
  size?: number;
  className?: string;
}

export default function FileIcon({ fileType, size = 20, className = '' }: Props) {
  const color = 'text-navy-500';
  if (fileType === 'JPG' || fileType === 'PNG') {
    return <FileImage size={size} className={`${color} ${className}`} />;
  }
  if (fileType === 'DOCX') {
    return <FileType2 size={size} className={`${color} ${className}`} />;
  }
  return <FileText size={size} className={`${color} ${className}`} />;
}
