export type UserRole = 'superadmin' | 'admin' | 'team' | 'client';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type UserWithPassword = User & {
  password: string;
};

export type LoginResponse = {
  message: string;
  user: User;
  access_token: string;
};

export type CreateUserResponse = {
  message: string;
  user: User;
};