import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

type Mode = 'signin' | 'signup';

export function AuthModal({ open, onClose, onSuccess, initialMode = 'signin' }: Props) {
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
  if (open) setMode(initialMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [open, initialMode]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.includes('@')) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setSubmitting(true);
    const fn = mode === 'signin' ? auth.signIn : auth.signUp;
    const { error: err } = await fn(email.trim(), password);
    setSubmitting(false);

    if (err) { setError(err); return; }

    if (mode === 'signup') {
      setSuccess('Account created. You can now use the app on any device.');
    }

    setPassword('');

    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, mode === 'signup' ? 1200 : 0);
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 backdrop-blur-md animate-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-sm overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] animate-modal-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex items-center justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
                {mode === 'signin' ? 'Welcome back' : 'Create account'}
              </p>
              <p
                id="auth-modal-title"
                className="mt-1 font-serif text-lg font-bold tracking-tight text-amber-950"
              >
                {mode === 'signin' ? 'Sign in' : 'Sign up'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-amber-50"
              aria-label="Close"
            >
              {'\u2715'}
            </button>
          </header>

          <form onSubmit={submit} className="space-y-4 p-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1 w-full rounded-md border border-amber-200 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="mt-1 w-full rounded-md border border-amber-200 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !auth.enabled}
              className={cn(
                'w-full rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors',
                submitting ? 'opacity-60' : 'hover:bg-amber-700',
              )}
            >
              {submitting ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>

            <p className="text-center text-[11px] text-muted-foreground">
              {mode === 'signin' ? "Don't have an account? " : 'Already have one? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError(null);
                  setSuccess(null);
                }}
                className="font-semibold text-amber-700 underline-offset-2 hover:underline"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </form>

          <p className="border-t border-amber-100 bg-amber-50/30 px-5 py-3 text-[10px] leading-relaxed text-muted-foreground">
            Your birth data is stored securely in your own account. Charts are still
            computed entirely in your browser - the server never sees your calculation.
          </p>
        </div>
      </div>
    </div>
  );
}