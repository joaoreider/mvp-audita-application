export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export interface SessionData {
  data: {
    id: number;
    email: string;
    name: string;
  };
  expires: string;
  iat: number;
  exp: number;
}
