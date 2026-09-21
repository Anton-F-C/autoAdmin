'use client';

import { useState, useEffect, useCallback } from 'react';

import { supabase } from 'src/lib/supabase';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

function flattenPresence(presenceState) {
  const onlineIds = new Set();

  Object.values(presenceState ?? {}).forEach((entries) => {
    entries.forEach((entry) => {
      if (entry?.user_id) onlineIds.add(entry.user_id);
    });
  });

  return onlineIds;
}

export function useAdminTeam() {
  const { user } = useAuthContext();
  const [team, setTeam] = useState([]);
  const [onlineIds, setOnlineIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTeam = useCallback(async () => {
    if (!user?.id) return;

    const { data, error: queryError } = await supabase
      .from('admin_profiles')
      .select('user_id,email,display_name,avatar_url,role,is_active,last_seen_at,created_at')
      .eq('is_active', true)
      .order('role', { ascending: true })
      .order('display_name', { ascending: true });

    if (queryError) {
      setError(queryError);
      setLoading(false);
      return;
    }

    setTeam(data ?? []);
    setError(null);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return undefined;

    let cancelled = false;
    loadTeam();

    const touchLastSeen = async () => {
      const { error: touchError } = await supabase.rpc('touch_admin_last_seen');
      if (touchError && !cancelled) console.error(touchError);
    };

    touchLastSeen();
    const heartbeat = window.setInterval(touchLastSeen, 60_000);

    const channel = supabase.channel('auto-admin-presence', {
      config: { presence: { key: user.id } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        if (!cancelled) setOnlineIds(flattenPresence(channel.presenceState()));
      })
      .on('presence', { event: 'join' }, () => {
        if (!cancelled) setOnlineIds(flattenPresence(channel.presenceState()));
      })
      .on('presence', { event: 'leave' }, () => {
        if (!cancelled) setOnlineIds(flattenPresence(channel.presenceState()));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            display_name: user.displayName,
            role: user.role,
            online_at: new Date().toISOString(),
          });
        }
      });

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') touchLastSeen();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [loadTeam, user?.displayName, user?.id, user?.role]);

  const members = team.map((member) => ({
    ...member,
    online: onlineIds.has(member.user_id),
  }));

  return { members, loading, error, reload: loadTeam };
}
