import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { useApi } from './useApi';
import { UserProfile, ProfileState } from '../types/profile';
import { ROUTES } from '../routes';

export const useProfile = () => {
  const navigate = useNavigate();
  const { state: authState, logout } = useAuth();
  const api = useApi();
  
  const [state, setState] = useState<ProfileState>({
    profile: null,
    isLoading: false,
    error: null,
  });

  const fetchProfile = useCallback(async () => {
    // Don't fetch if not authenticated
    if (!authState.isAuthenticated || !authState.token) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await api.get<UserProfile>('/profile');
      
      if (response.error) {
        // Check if token is expired or invalid
        if (response.error.includes('unauthorized') || response.error.includes('token')) {
          // Force logout and redirect to login
          logout();
          navigate(ROUTES.LOGIN);
          return;
        }
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Unknown error',
        }));
        return;
      }
      
      setState({
        profile: response.data || null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch profile data',
      }));
    }
  }, [api, authState.isAuthenticated, authState.token, logout, navigate]);

  // Fetch profile on mount and when auth state changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refreshProfile = () => {
    fetchProfile();
  };

  return {
    ...state,
    refreshProfile,
  };
}; 