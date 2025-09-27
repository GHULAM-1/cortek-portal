export type UserRole = 'superadmin' | 'admin' | 'team' | 'client';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type LoginRequest = Pick<User, 'email'> & {
  password: string;
};

export type LoginResponse = {
  message: string;
  user: User;
};

export type CreateUserRequest = Omit<User, 'id' | 'created_at' | 'updated_at'> & {
  password: string;
};

export type CreateUserResponse = {
  message: string;
  user: User;
};

export type UpdateUserRequest = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>> & {
  password?: string;
};