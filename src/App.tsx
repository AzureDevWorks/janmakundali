import { useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useBirthStore } from '@/features/birth/birthStore';
import { useProfilesQuery, useSaveProfile } from '@/features/profiles/useProfiles';
import { storedToBirthProfile } from '@/features/profiles/profiles.types';
import { ProfileModal } from '@/features/profiles/ProfileModal';
import { WelcomeScreen } from '@/features/profiles/WelcomeScreen';
import { LandingView } from '@/views/LandingView';
import { HomeView } from '@/views/HomeView';

export default function App() {
  const auth = useAuth();
  const profile = useBirthStore((s) => s.profile);
  const setProfileWithId = useBirthStore((s) => s.setProfileWithId);
  const resetProfile = useBirthStore((s) => s.resetProfile);

  const profilesQuery = useProfilesQuery(auth.user?.id);
  const saveProfileMutation = useSaveProfile();

  const autoLoadRef = useRef(false);
  const migrateRef = useRef(false);
  const wasSignedInRef = useRef(false);

  // Clean up legacy flag
  useEffect(() => {
    try { localStorage.removeItem('janmakundali:guest-mode'); } catch { /* ignore */ }
  }, []);

  // Sign out clears everything
  useEffect(() => {
    const signedOut = wasSignedInRef.current && !auth.user;
    if (signedOut) {
      try {
        resetProfile();
        autoLoadRef.current = false;
        migrateRef.current = false;
      } catch (e) {
        console.error('[app] Sign-out cleanup failed:', e);
      }
    }
    wasSignedInRef.current = !!auth.user;
  }, [auth.user, resetProfile]);

  // Auto-load first cloud profile when signed in with no local profile
  useEffect(() => {
    if (!auth.user) return;
    if (profile) return;
    if (autoLoadRef.current) return;
    if (!profilesQuery.data || profilesQuery.data.length === 0) return;

    autoLoadRef.current = true;
    const most = profilesQuery.data[0];
    setProfileWithId(most.id, storedToBirthProfile(most));
    console.log('[profiles] Auto-loaded from cloud:', most.name);
  }, [auth.user, profile, profilesQuery.data, setProfileWithId]);

  // Migrate local profile to cloud on first sign-in if cloud is empty
  useEffect(() => {
    if (!auth.user) return;
    if (!profile) return;
    if (migrateRef.current) return;
    if (!profilesQuery.data || profilesQuery.data.length > 0) return;

    migrateRef.current = true;
    saveProfileMutation.mutate(
      { profile, relation: 'self' },
      {
        onSuccess: (data) => {
          console.log('[profiles] Migrated local profile to cloud');
          setProfileWithId(data.id, profile);
        },
        onError: (err) => {
          console.error('[profiles] Migration failed:', err);
          migrateRef.current = false;
        },
      },
    );
  }, [auth.user, profile, profilesQuery.data, saveProfileMutation, setProfileWithId]);

  const authResolving = auth.enabled && auth.loading;
  const profilesResolving = auth.user && profilesQuery.isLoading;

  if (authResolving || profilesResolving) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50 to-background">
        <span className="font-serif text-sm italic text-amber-700/70">Loading...</span>
      </div>
    );
  }

  // Not signed in → landing
  if (!auth.user) {
    return (
      <>
        <LandingView />
        <ProfileModal />
      </>
    );
  }

  // Signed in, no profiles anywhere → welcome
  const cloudCount = profilesQuery.data?.length ?? 0;
  if (!profile && cloudCount === 0) {
    return (
      <>
        <WelcomeScreen />
        <ProfileModal />
      </>
    );
  }

  // Signed in with profile → app
  return (
    <>
      <HomeView />
      <ProfileModal />
    </>
  );
}