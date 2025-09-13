import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCredentials, UserRegistration } from '../types/auth';
import { PointTransaction } from '../types/points';
import { CompanyDetails } from '../types/company';
import { DashboardData } from '../types/dashboard';

const api = axios.create({
  baseURL: 'https://fideliza-backend.onrender.com/api/v1',
});

// Garante que o token seja anexado mesmo em cold start
api.interceptors.request.use(async (config) => {
  try {
    const hasAuth = config.headers && (config.headers as any)['Authorization'];
    if (!hasAuth) {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        (config.headers as any)['Authorization'] = `Bearer ${storedToken}`;
      }
    }
  } catch {
    // ignora, segue sem token
  }
  return config;
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = (credentials: UserCredentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  return api.post('/token', formData.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const registerClient = (userData: UserRegistration) => {
  return api.post('/register/client/', userData);
};

export const getMyProfile = () => {
  return api.get('/users/me');
};

// CORREÇÃO: Nome da função padronizado e tipo de retorno explícito
export const getClientDashboard = async (): Promise<DashboardData> => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const requestPasswordRecovery = (email: string) => {
  return api.post('/request-password-recovery', { email });
};

export const resetPassword = (token: string, new_password: string) => {
  return api.post('/reset-password', { token, new_password });
};

export const getCompanies = async (): Promise<CompanyDetails[]> => {
    const response = await api.get('/companies');
    return response.data;
};

export const getMyPointsByCompany = () => {
  return api.get('/points/my-points');
};

export const getPointTransactionsByCompany = async (companyId: number): Promise<PointTransaction[]> => {
    const response = await api.get(`/points/my-transactions/${companyId}`);
    return response.data;
};

export const getMyRewardsStatus = () => {
  return api.get('/rewards/my-status');
};

export const redeemReward = (rewardId: number) => {
  return api.post('/rewards/redeem', { reward_id: rewardId });
};

export const updateMyProfile = (userData: { name?: string; password?: string }) => {
  return api.patch('/users/me', userData);
};

export default api;
