export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

export const ROLE_LABELS = {
  [ROLES.OWNER]: 'Owner',
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.MODERATOR]: 'Moderator',
};

export const PERMISSIONS = {
  VIEW_FINANCE: 'view_finance',
  MANAGE_FINANCE: 'manage_finance',
  MANAGE_USERS: 'manage_users',
  SEND_MESSAGES: 'send_messages',
  MANAGE_SERVICES: 'manage_services',
  MANAGE_CONTRACTS: 'manage_contracts',
  MANAGE_INTEGRATIONS: 'manage_integrations',
  MANAGE_ROLES: 'manage_roles',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
};

export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.MANAGE_FINANCE,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.SEND_MESSAGES,
    PERMISSIONS.MANAGE_SERVICES,
    PERMISSIONS.MANAGE_CONTRACTS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
  [ROLES.MODERATOR]: [],
};

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
