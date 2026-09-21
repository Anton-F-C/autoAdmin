'use client';

import { ROLES } from 'src/auth/roles';
import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

export default function SystemLayout({ children }) {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={[ROLES.OWNER]}>
      {children}
    </RoleBasedGuard>
  );
}
