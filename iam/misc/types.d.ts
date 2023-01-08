export type User = {
  id: number;
  first_name: string;
  last_name: string;
  uuid: string;
  email: string;
  password: string;
  role: "ADMIN" | "GENERAL";
  email_verified: boolean;
  last_login: Date | null;
  created_at: Date;
};

export type JSONResponse = {
  status: "success" | "fail";
  data: any;
  error?: any;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type ClientPlatforms = "app" | "browser" | "browser-dev";

export type EmailOptions = {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
};

export type RolePermission = {
  id: number;
  user_uuid: string;
  is_super_admin: boolean;
  is_admin: boolean;
  is_general: boolean;
  date_created: Date;
};

export type RolePermissions = Array<RolePermission>;
