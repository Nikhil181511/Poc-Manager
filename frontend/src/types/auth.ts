export type UserRole = 
  | 'Super Admin'
  | 'Organization Admin'
  | 'Project Manager'
  | 'Researcher'
  | 'Developer'
  | 'Reviewer'
  | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team_id?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
