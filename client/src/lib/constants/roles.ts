export const ROLES = {
  SUPERADMIN: 'superAdmin',
  ADMIN: 'admin',
  TEAM: 'team',
  CLIENT: 'client',
} as const;

export const ROLE_LABELS = {
  SUPERADMIN: 'Super Admin',
  ADMIN: 'Admin',
  TEAM: 'Team',
  CLIENT: 'Client',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

