export type User = {
  id: number;
  first_name: string;
  last_name: string;
  uuid: string;
  email: string;
  password: string;
  role: Role;
  password_verified: boolean;
  last_login: Date | null;
  refresh_token_id: string;
};

enum Role {
  GENERAL,
  ADMIN,
}

export type JSONResponse = {
  status: JSONResponseStatus.FAIL | JSONResponseStatus.SUCCESS;
  data: any;
  error?: any;
};

enum JSONResponseStatus {
  SUCCESS = "success",
  FAIL = "fail",
}

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type ClientPlatforms = "app" | "browser" | "browser-dev";
