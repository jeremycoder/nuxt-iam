export type User = {
  id: number;
  first_name: string;
  last_name: string;
  uuid: string;
  email: string;
  password: string;
  avatar?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "GENERAL";
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

export type UsersTablePermission = {
  id: number;
  user_id?: number;
  can_create?: boolean;
  can_read?: string;
  can_update?: string;
  can_delete?: string;
  expires_at?: Date;
  updated_at?: Date;
  created_at?: Date;
};

export type UsersTablePermissions = Array<UsersTablePermission>;

export type UsersTableEditable = {
  first_name?: string;
  last_name?: string;
  role?: string;
};

export type NewUser = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
