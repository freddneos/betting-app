import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';

interface AuthContextType {
  token: string | null;
  login: (param: { email: string, password: string }) => Promise<void>;
  signup: (param: { email: string, password: string }) => Promise<void>;
  logout: () => void;
  me: () => Promise<{ email: string; balance: number }>;
  isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedToken = localStorage.getItem('@app-token');
    if (storedToken) {
      setToken(storedToken);
    }
    setInitialized(true);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiClient.post('/login', { email, password });
      return response.data.token;
    },
    onSuccess: (receivedToken) => {
      setToken(receivedToken);
      localStorage.setItem('@app-token', receivedToken);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['my-bets'] });
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed', error);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      await apiClient.post('/signup', { email, password });
      await loginMutation.mutateAsync({ email, password });
    },
    onError: (error) => {
      console.error('Signup failed', error);
    },
  });

  const { data: userData, refetch: refetchMe } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await apiClient.get('/me');
      return response.data;
    },
    enabled: !!token,
    onError: (error) => {
      console.error('Failed to fetch user data', error);
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.removeItem('@app-token');
    queryClient.clear(); // Clear all queries
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const me = async () => {
    if (!userData) {
      await refetchMe();
    }
    return userData || { email: '', balance: 0 };
  };

  return (
    <AuthContext.Provider value={{ token, login: loginMutation.mutateAsync, signup: signupMutation.mutateAsync, logout, me, isAuthenticated }}>
      {initialized && children}
    </AuthContext.Provider>
  );
};
