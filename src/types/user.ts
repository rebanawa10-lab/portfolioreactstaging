// file:    src/types/user.ts


export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  is_admin: number;
  sysInsDate?: string;
}