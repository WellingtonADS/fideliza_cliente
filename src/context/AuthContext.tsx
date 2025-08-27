import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserCredentials, UserRegistration } from '../types/auth';
import { login as apiLogin, registerClient, getMyProfile, setAuthToken } from '../services/api';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: UserCredentials) => Promise<void>;
  signUp: (userData: UserRegistration) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

// CORREÇÃO: Adicionado 'export' para que o contexto possa ser importado em outros lugares
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTokenFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
          const response = await getMyProfile();
          setUser(response.data);
        }
      } catch (error) {
        console.error("Falha ao carregar token do storage", error);
        await signOut(); 
      } finally {
        setIsLoading(false);
      }
    };
    loadTokenFromStorage();
  }, []);

  const signIn = async (credentials: UserCredentials) => {
    try {
      const response = await apiLogin(credentials);
      const { access_token } = response.data;
      setToken(access_token);
      setAuthToken(access_token);
      await AsyncStorage.setItem('userToken', access_token);
      const profileResponse = await getMyProfile();
      setUser(profileResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error('Email ou senha inválidos.');
        }
      }
      throw new Error('Não foi possível conectar ao servidor. Tente novamente.');
    }
  };

  const signUp = async (userData: UserRegistration) => {
    try {
      await registerClient(userData);
      await signIn({ email: userData.email, password: userData.password });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
         throw new Error(error.response.data.detail);
      }
      throw new Error('Ocorreu um erro ao tentar registar. Tente novamente.');
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(undefined);
    await AsyncStorage.removeItem('userToken');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const profileResponse = await getMyProfile();
      setUser(profileResponse.data);
    } catch (error) {
      await signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
