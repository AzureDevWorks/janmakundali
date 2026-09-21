import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseEnabled } from '@/lib/supabase';

export interface AuthApi {
  user: User | null;
  session: Session | null;
  loading: boolean;
  enabled: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthApi {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseEnabled);

  useEffect(() => {
    if (!supabaseEnabled) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return {
    user: session?.user ?? null,
    session,
    loading,
    enabled: supabaseEnabled,

    async signIn(email, password) {
      if (!supabaseEnabled) return { error: 'Auth is not configured.' };
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      } catch (e) {
        return { error: (e as Error).message };
      }
    },

    async signUp(email, password) {
      if (!supabaseEnabled) return { error: 'Auth is not configured.' };
      try {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error?.message ?? null };
      } catch (e) {
        return { error: (e as Error).message };
      }
    },

    async signOut() {
      if (!supabaseEnabled) return;
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('[auth] Sign out failed:', e);
      }
      // Clear any local session-adjacent state so the app fully resets
      try {
        localStorage.removeItem('janmakundali:guest-mode');
      } catch { /* ignore */ }
    },
  };
}