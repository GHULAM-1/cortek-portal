export type Superadmin = {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export type SuperadminWithPassword = Superadmin & {
  password: string;
}

export type SuperadminLoginResponse = {
  message: string;
  superadmin: Superadmin;
}

export type SuperadminUpdateResponse = {
  message: string;
  superadmin: Superadmin;
}