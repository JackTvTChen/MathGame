export interface UserProfile {
  id: string;
  username: string;
  email: string;
  score: number;
  avatar?: string;
  joinedAt: string;
  lastActive: string;
}

export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
} 