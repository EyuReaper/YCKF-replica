'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { BackendApi } from '@/lib/backend'; // Import for login call

interface User {
  id: string;
  name: string;
  email: string;
  role: string; // e.g., 'student', 'admin'
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  requireLogin: (redirectUrl: string) => void; // New: Added per diff
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await BackendApi.login({ email, password });
      if (response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        router.push('/student-dashboard'); // Or redirect to intended page
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  // New: requireLogin function (per diff)
  const requireLogin = (redirectUrl: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    requireLogin, // New: Exposed in return value
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};