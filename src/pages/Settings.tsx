import { useState } from 'react';
import {
  User as UserIcon, Lock, Bell, KeyRound, Users, Plus, Check, X,
  ShieldCheck, Mail,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Modal from '@/components/Modal';
import { currentUser, users } from '@/data/mock';
import type { UserRole } from '@/types';

const sections = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'permissions', label: 'Access Permissions', icon: KeyRound },
  { id: 'users', label: 'User & Role Management', icon: Users, adminOnly: true },
] as const;

type SectionId = (typeof sections)[number]['id'];

const roles: UserRole[] = [
  'Administrator', 'Investigation Officer', 'Forensic Officer', 'Legal Officer', 'Authorized Viewer',
];

const permissionsMatrix = [
  { capability: 'View documents', roles: { Administrator: true, 'Investigation Officer': true, 'Forensic Officer': true, 'Legal Officer': true, 'Authorized Viewer': true } },
  { capability: 'Upload documents', roles: { Administrator: true, 'Investigation Officer': true, 'Forensic Officer': true, 'Legal Officer': true, 'Authorized Viewer': false } },
  { capability: 'Download documents', roles: { Administrator: true, 'Investigation Officer': true, 'Forensic Officer': true, 'Legal Officer': true, 'Authorized Viewer': false } },
  { capability: 'Create & manage cases', roles: { Administrator: true, 'Investigation Officer': true, 'Forensic Officer': false, 'Legal Officer': true, 'Authorized Viewer': false } },
  { capability: 'Share documents', roles: { Administrator: true, 'Investigation Officer': true, 'Forensic Officer': true, 'Legal Officer': true, 'Authorized Viewer': false } },
  { capability: 'Verify integrity', roles: { Administrator: true, 'Investigation Officer': true, 'Forensic Officer': true, 'Legal Officer': false, 'Authorized Viewer': false } },
  { capability: 'View audit trail', roles: { Administrator: true, 'Investigation Officer': true, 'Forensic Officer': false, 'Legal Officer': false, 'Authorized Viewer': false } },
  { capability: 'Manage users & roles', roles: { Administrator: true, 'Investigation Officer': false, 'Forensic Officer': false, 'Legal Officer': false, 'Authorized Viewer': false } },
  { capability: 'Resolve security alerts', roles: { Administrator: true, 'Investigation Officer': false, 'Forensic Officer': false, 'Legal Officer': false, 'Authorized Viewer': false } },
] as const;

const isAdmin = currentUser.role === 'Administrator' || currentUser.role === 'Investigation Officer';

export default function Settings() {
  const [section, setSection] = useState<SectionId>('profile');
  const [notifPrefs, setNotifPrefs] = useState({
    integrityAlerts: true,
    accessChanges: true,
    newDocuments: false,
    weeklySummary: true,
  });
  const [addUserOpen, setAddUserOpen] = useState(false);

  const visibleSections = sections.filter((s) => !('adminOnly' in s && s.adminOnly) || isAdmin);
  const activeSection = visibleSections.find((s) => s.id === section) || visibleSections[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile, security and access preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar nav */}
        <nav className="lg:col-span-1">
          <Card padding="sm">
            <ul className="space-y-1">
              {visibleSections.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setSection(s.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        activeSection.id === s.id
                          ? 'bg-navy-50 text-navy-800'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={17} className={activeSection.id === s.id ? 'text-navy-600' : 'text-slate-400'} />
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </nav>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection.id === 'profile' && (
            <Card>
              <h2 className="font-semibold text-navy-900">Profile</h2>
              <p className="mt-1 text-sm text-slate-500">Update your personal information.</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-700 text-xl font-semibold text-white">
                  {currentUser.initials}
                </div>
                <Button variant="outline" size="sm">Change photo</Button>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full name" defaultValue={currentUser.name} />
                <Input label="Employee ID" defaultValue="EMP-1023" />
                <Input label="Email" type="email" defaultValue={currentUser.email} icon={<Mail size={18} />} />
                <Input label="Department" defaultValue="Investigation" />
                <Select label="Role" defaultValue={currentUser.role}>
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </Select>
                <Input label="Phone" defaultValue="+91 98765 43210" />
              </div>
              <div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <Button variant="outline">Cancel</Button>
                <Button>Save changes</Button>
              </div>
            </Card>
          )}

          {activeSection.id === 'security' && (
            <div className="space-y-6">
              <Card>
                <h2 className="font-semibold text-navy-900">Password</h2>
                <p className="mt-1 text-sm text-slate-500">Change your password regularly to keep your account secure.</p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:max-w-md">
                  <Input label="Current password" isPassword placeholder="Enter current password" />
                  <Input label="New password" isPassword placeholder="Enter new password" />
                  <Input label="Confirm new password" isPassword placeholder="Re-enter new password" />
                </div>
                <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
                  <Button>Update password</Button>
                </div>
              </Card>
              <Card>
                <h2 className="font-semibold text-navy-900">Two-factor authentication</h2>
                <p className="mt-1 text-sm text-slate-500">Add an extra layer of security to your account.</p>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-900">Authenticator app</p>
                      <p className="text-xs text-slate-500">Enabled · last verified 20 Aug 2026</p>
                    </div>
                  </div>
                  <Badge tone="teal" icon={<Check size={13} />}>Active</Badge>
                </div>
              </Card>
            </div>
          )}

          {activeSection.id === 'notifications' && (
            <Card>
              <h2 className="font-semibold text-navy-900">Notification Preferences</h2>
              <p className="mt-1 text-sm text-slate-500">Choose what you want to be notified about.</p>
              <div className="mt-5 space-y-3">
                {[
                  { key: 'integrityAlerts', label: 'Integrity alerts', desc: 'When a document fails integrity verification' },
                  { key: 'accessChanges', label: 'Access & permission changes', desc: 'When permissions are changed on your documents' },
                  { key: 'newDocuments', label: 'New documents uploaded', desc: 'When a new document is added to a case you handle' },
                  { key: 'weeklySummary', label: 'Weekly summary', desc: 'A weekly digest of activity in your workspace' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-navy-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifPrefs[item.key as keyof typeof notifPrefs]}
                      onChange={(e) =>
                        setNotifPrefs((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-slate-300 transition-colors checked:bg-navy-600 relative after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform checked:after:translate-x-4"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
                <Button>Save preferences</Button>
              </div>
            </Card>
          )}

          {activeSection.id === 'permissions' && (
            <Card>
              <h2 className="font-semibold text-navy-900">Your Access Permissions</h2>
              <p className="mt-1 text-sm text-slate-500">
                What you can do based on your role: <Badge tone="navy">{currentUser.role}</Badge>
              </p>
              <ul className="mt-5 space-y-2">
                {permissionsMatrix.map((p) => {
                  const allowed = p.roles[currentUser.role];
                  return (
                    <li
                      key={p.capability}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
                    >
                      <span className="text-sm text-navy-800">{p.capability}</span>
                      {allowed ? (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-teal-700">
                          <Check size={16} /> Allowed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                          <X size={16} /> Not allowed
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {activeSection.id === 'users' && isAdmin && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-navy-900">User & Role Management</h2>
                    <p className="mt-1 text-sm text-slate-500">Manage users and their access levels.</p>
                  </div>
                  <Button icon={<Plus size={18} />} onClick={() => setAddUserOpen(true)}>Add User</Button>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-700">
                                {u.initials}
                              </div>
                              <span className="font-medium text-navy-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">{u.email}</td>
                          <td className="px-4 py-3.5"><Badge tone="navy">{u.role}</Badge></td>
                          <td className="px-4 py-3.5 text-right">
                            <button className="text-sm font-medium text-navy-600 hover:text-navy-800">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <h2 className="font-semibold text-navy-900">Role Permissions Matrix</h2>
                <p className="mt-1 text-sm text-slate-500">What each role can do across the system.</p>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="px-4 py-3">Capability</th>
                        {roles.map((r) => (
                          <th key={r} className="px-3 py-3 text-center">{r.split(' ')[0]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {permissionsMatrix.map((p) => (
                        <tr key={p.capability} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-navy-900">{p.capability}</td>
                          {roles.map((r) => (
                            <td key={r} className="px-3 py-3 text-center">
                              {p.roles[r] ? (
                                <Check size={16} className="mx-auto text-teal-600" />
                              ) : (
                                <X size={16} className="mx-auto text-slate-300" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        title="Add new user"
        description="Create a new account and assign a role."
        footer={
          <>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddUserOpen(false)}>Add user</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" placeholder="e.g. Priya Nair" />
          <Input label="Email" type="email" placeholder="e.g. p.nair@nyayavault.gov.in" icon={<Mail size={18} />} />
          <Input label="Employee ID" placeholder="e.g. EMP-1042" />
          <Select label="Role" defaultValue="Authorized Viewer">
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </div>
      </Modal>
    </div>
  );
}
