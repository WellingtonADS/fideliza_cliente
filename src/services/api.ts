import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCredentials, UserRegistration } from '../types/auth';
import { PointTransaction } from '../types/points';
import { CompanyDetails } from '../types/company';
import { DashboardData } from '../types/dashboard';

// Define base URLs para ambiente local
const LOCAL_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api/v1', // Emulador Android acessando host
  ios: 'http://localhost:8000/api/v1',     // Simulador iOS
  default: 'http://localhost:8000/api/v1', // Fallback
});
// Enquanto estivermos apenas em ambiente local, mantemos PROD apontando para LOCAL
const PROD_BASE_URL = LOCAL_BASE_URL as string;

// Usa sempre backend local (mesmo em release) para o cenário atual sem Render
const api = axios.create({
  baseURL: __DEV__ ? LOCAL_BASE_URL : PROD_BASE_URL,
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

// Trata respostas de erro para mensagens claras ao usuário
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status as number | undefined;
    const detail = error?.response?.data?.detail as string | undefined;

    // Mapear status para mensagens amigáveis
    let message: string | undefined;
    if (status === 401) {
      message = detail || 'Sessão expirada. Entre novamente.';
      // Limpa token e segue para que a UI possa redirecionar para Login
      await AsyncStorage.removeItem('userToken');
      delete api.defaults.headers.common['Authorization'];
    } else if (status === 403) {
      message = detail || 'Acesso negado. Permissões insuficientes.';
    } else if (status === 429) {
      message = detail || 'Muitas requisições. Tente novamente em instantes.';
    } else if (status && status >= 500) {
      message = detail || 'Erro no servidor. Tente novamente mais tarde.';
    }

    if (message) {
      // Evita dependências extras: delega para quem consome o serviço mostrar o toast/alert
      // Encapsula a mensagem na própria instância de erro
      error.userMessage = message;
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Permite ajustar dinamicamente a baseURL em tempo de execução, se necessário
export const setBaseURL = (url: string) => {
  api.defaults.baseURL = url;
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
  // app_type 'client' garante que o e-mail contenha fidelizacliente://
  return api.post('/request-password-recovery', { email, app_type: 'client' });
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
