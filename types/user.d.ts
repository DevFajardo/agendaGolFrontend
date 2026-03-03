export type UserRole = 'admin' | 'user'; 
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string; 
}