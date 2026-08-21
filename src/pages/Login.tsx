import { useState } from 'react';
import { Mail, Lock, ShieldCheck, FileText, FolderLock, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useApp } from '@/store';

export default function Login() {
  const { navigate } = useApp();
  const [email, setEmail] = useState('a.sharma@nyayavault.gov.in');
  const [password, setPassword] = useState('••••••••');
  const [remember, setRemember] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: 'dashboard' });
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left panel */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-navy-900 px-8 py-12 text-white lg:w-1/2 lg:px-14 lg:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px, 64px 64px',
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-navy-500/20 blur-3xl" />

        <div className="relative">
          <Logo size="lg" theme="dark" />
        </div>

        <div className="relative my-10 max-w-md">
          <h1 className="text-3xl font-semibold leading-tight lg:text-4xl">
            Secure documents.
            <br />
            Trusted evidence.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy-200">
            A secure platform for managing legal, investigation and evidence-related documents —
            with access controls, integrity verification and full activity monitoring.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              'Role-based access for officers and legal staff',
              'Document integrity verification on every upload',
              'Complete audit trail of all activity',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-navy-100">
                <CheckCircle2 size={18} className="shrink-0 text-teal-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Abstract illustration */}
        <div className="relative hidden lg:block">
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-14 items-center justify-center rounded-lg border border-navy-600 bg-navy-800/60">
                <FileText size={22} className="text-navy-200" />
              </div>
              <div className="h-2 w-14 rounded-full bg-navy-700" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-24 w-20 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-500/10 shadow-lg">
                <ShieldCheck size={30} className="text-teal-300" />
              </div>
              <div className="h-2 w-20 rounded-full bg-teal-600/40" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-16 items-center justify-center rounded-lg border border-navy-600 bg-navy-800/60">
                <FolderLock size={24} className="text-navy-200" />
              </div>
              <div className="h-2 w-16 rounded-full bg-navy-700" />
            </div>
          </div>
        </div>

        <div className="relative text-xs text-navy-300">
          © 2026 NyayaVault. Authorized personnel only.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to access your authorized workspace.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <Input
              label="Email or Employee ID"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              placeholder="you@nyayavault.gov.in"
              autoComplete="username"
            />
            <Input
              label="Password"
              name="password"
              isPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm font-medium text-navy-600 hover:text-navy-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" size="lg" block>
              Sign In
            </Button>
          </form>

          <div className="mt-8 flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-teal-600" />
            <p className="text-xs leading-relaxed text-slate-500">
              Your documents are protected with secure access controls and activity monitoring.
              All sign-in attempts are recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
