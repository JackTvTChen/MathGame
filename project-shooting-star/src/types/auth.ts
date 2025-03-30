export interface User {
  id: string;
  username: string;
  email: string;
  // Add any other user properties
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'VALIDATE_TOKEN_REQUEST' }
  | { type: 'VALIDATE_TOKEN_SUCCESS'; payload: { user: User } }
  | { type: 'VALIDATE_TOKEN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }; 