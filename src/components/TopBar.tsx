import { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '@/store';
import Logo from './Logo';
import Badge from './Badge';
import { securityAlerts } from '@/data/mock';

interface Props {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: Props) {
  const { user, navigate, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeAlerts = securityAlerts.filter((a) => a.status === 'Requires Review').length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center lg:hidden">
        <Logo size="sm" />
      </div>

      <div className="relative hidden max-w-md flex-1 lg:block">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search documents, cases, people..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-navy-400 focus:bg-white focus:ring-2 focus:ring-navy-500/15 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => navigate({ name: 'security' })}
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {activeAlerts > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg p-1.5 pl-2 hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-sm font-semibold text-white">
              {user.initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-navy-900">{user.name}</p>
              <p className="text-xs leading-tight text-slate-500">{user.role}</p>
            </div>
            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
              <div className="absolute right-0 top-full z-20 mt-2 w-60 animate-fade-in rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-navy-900">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                  <div className="mt-2">
                    <Badge tone="navy">{user.role}</Badge>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate({ name: 'settings' });
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <UserIcon size={16} className="text-slate-400" /> Profile
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate({ name: 'settings' });
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <SettingsIcon size={16} className="text-slate-400" /> Settings
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
