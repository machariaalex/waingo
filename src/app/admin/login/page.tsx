'use client';
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.push('/admin');
  }, [session, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { ...creds, redirect: false });
    if (result?.error) {
      setError('Invalid username or password.');
    } else {
      router.push('/admin');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-charcoal-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-soil-red rounded flex items-center justify-center mx-auto mb-3">
            <span className="font-heading font-bold text-manila text-xl">W</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-manila">Waingo Admin</h1>
          <p className="font-mono text-xs text-manila/40 mt-1 uppercase tracking-widest">Back-office Login</p>
        </div>

        <form onSubmit={submit} className="bg-light-manila rounded-sm p-6 space-y-4">
          <div>
            <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">Username</label>
            <input
              value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              autoComplete="username"
              className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-soil-red"
              placeholder="wilson"
              required
            />
          </div>
          <div>
            <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">Password</label>
            <input
              type="password"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              autoComplete="current-password"
              className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-soil-red"
              required
            />
          </div>
          {error && <p className="text-soil-red font-mono text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-soil-red text-manila font-heading font-bold py-3 rounded-sm hover:bg-dark-soil transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
