import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  UploadCloud,
  Sparkles,
  ScrollText,
  Bell,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '@/store';
import type { Route } from '@/store';
import Logo from './Logo';
import { securityAlerts } from '@/data/mock';

const navItems: { label: string; icon: typeof LayoutDashboard; route: Route; match: string[] }[] = [
  { label: 'Dashboard', icon: LayoutDashboard, route: { name: 'dashboard' }, match: ['dashboard'] },
  { label: 'Cases', icon: FolderKanban, route: { name: 'cases' }, match: ['cases', 'case-details'] },
  { label: 'Documents', icon: FileText, route: { name: 'documents' }, match: ['documents', 'document-details'] },
  { label: 'Upload Document', icon: UploadCloud, route: { name: 'upload' }, match: ['upload'] },
  { label: 'AI Assistant', icon: Sparkles, route: { name: 'ai-assistant' }, match: ['ai-assistant'] },
  { label: 'Audit Trail', icon: ScrollText, route: { name: 'audit' }, match: ['audit'] },
  { label: 'Notifications', icon: Bell, route: { name: 'security' }, match: ['security'] },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const { route, navigate } = useApp();
  const activeAlerts = securityAlerts.filter((a) => a.status === 'Requires Review').length;

  const go = (r: Route) => {
    navigate(r);
    onClose();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-navy-950/40 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <button onClick={() => go({ name: 'dashboard' })} className="transition-opacity hover:opacity-80">
            <Logo size="sm" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
          <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          {navItems.map((item) => {
            const active = item.match.includes(route.name);
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => go(item.route)}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-navy-50 text-navy-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-navy-800'
                }`}
              >
                <Icon
                  size={18}
                  className={active ? 'text-navy-700' : 'text-slate-400 group-hover:text-navy-600'}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.label === 'Notifications' && activeAlerts > 0 && (
                  <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">
                    {activeAlerts}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            onClick={() => go({ name: 'security' })}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              route.name === 'security'
                ? 'bg-navy-50 text-navy-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-navy-800'
            }`}
          >
            <ShieldAlert size={18} className={route.name === 'security' ? 'text-navy-700' : 'text-slate-400 group-hover:text-navy-600'} />
            <span>Security Alerts</span>
            {activeAlerts > 0 && (
              <span className="ml-auto rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">
                {activeAlerts}
              </span>
            )}
          </button>
          <button
            onClick={() => go({ name: 'settings' })}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              route.name === 'settings'
                ? 'bg-navy-50 text-navy-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-navy-800'
            }`}
          >
            <Settings size={18} className={route.name === 'settings' ? 'text-navy-700' : 'text-slate-400 group-hover:text-navy-600'} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
