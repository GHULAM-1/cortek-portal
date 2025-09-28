export type SuperAdmin = {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type SuperAdminWithPassword = SuperAdmin & {
  password: string;
};

export type SuperAdminLoginResponse = {
  message: string;
  superAdmin: SuperAdmin;
};

export type SuperAdminUpdateResponse = {
  message: string;
  superAdmin: SuperAdmin;
};
