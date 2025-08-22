// src/services/api.ts
import axios from 'axios';
import { UserCredentials, UserRegistration } from '../types/auth';

// Crie uma instância do Axios
const api = axios.create({
  // IMPORTANTE: Substitua pela URL base da sua API do backend
  // Para emulador Android, use http://10.0.2.2:8000
  // Para emulador iOS ou dispositivo físico na mesma rede, use o IP da sua máquina
  baseURL: 'http://10.0.2.2:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para injetar o token de autenticação em todas as requisições.
 * A função setAuthToken será chamada a partir do nosso AuthContext.
 */
export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Função para login do utilizador.
 * Corresponde ao endpoint: POST /token
 * @param credentials - Email e password do utilizador.
 */
export const login = (credentials: UserCredentials) => {
  // A API espera dados de formulário, então precisamos formatá-los.
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  return api.post('/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

/**
 * Função para registar um novo cliente.
 * Corresponde ao endpoint: POST /register/client/
 * @param userData - Nome, email e password do novo cliente.
 */
export const registerClient = (userData: UserRegistration) => {
  return api.post('/register/client/', userData);
};

/**
 * Função para buscar os dados do utilizador logado.
 * Corresponde ao endpoint: GET /users/me
 */
export const getMyProfile = () => {
  return api.get('/users/me');
};


// --- Outras funções da API que serão usadas nas próximas fases ---

// Função para buscar a lista de todas as empresas parceiras
export const getCompanies = () => {
  return api.get('/companies');
};

// Função para buscar os pontos do cliente por empresa
export const getMyPointsByCompany = () => {
  return api.get('/points/my-points');
};

export default api;
