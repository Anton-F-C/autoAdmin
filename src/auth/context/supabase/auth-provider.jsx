'use client';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios from 'src/lib/axios';
import { supabase } from 'src/lib/supabase';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

function buildAdminUser(session, profile) {
  const authUser = session?.user;

  if (!authUser || !profile) return null;

  return {
    ...authUser,
    id: authUser.id,
    accessToken: session.access_token,
    email: authUser.email,
    displayName: profile.display_name,
    photoURL: profile.avatar_url,
    role: profile.role,
    isActive: profile.is_active,
    lastSeenAt: profile.last_seen_at,
    adminProfile: profile,
  };
}

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        delete axios.defaults.headers.common.Authorization;
        setState({ user: null, loading: false });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('user_id,email,display_name,avatar_url,role,is_active,last_seen_at,created_at,updated_at')
        .eq('user_id', session.user.id)
        .maybeSingle();

      // A valid Supabase account is not enough to enter AutoAdmin. The user
      // must also have an enabled admin_profiles record.
      if (profileError || !profile || !profile.is_active) {
        console.error(profileError ?? new Error('No active AutoAdmin profile found.'));
        await supabase.auth.signOut();
        delete axios.defaults.headers.common.Authorization;
        setState({ user: null, loading: false });
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${session.access_token}`;
      setState({ user: buildAdminUser(session, profile), loading: false });
    } catch (error) {
      console.error(error);
      delete axios.defaults.headers.common.Authorization;
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUserSession();
    });

    return () => subscription.unsubscribe();
  }, [checkUserSession]);

  const status = state.loading ? 'loading' : state.user ? 'authenticated' : 'unauthenticated';

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
