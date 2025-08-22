// src/types/auth.ts

// Para a função de login
export interface UserCredentials {
  email: string;
  password: string;
}

// Para a função de registo
export interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

// Para o objeto de utilizador retornado pela API
export interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
  qr_code_base64?: string;
}
// Para o objeto de resposta da API de autenticação
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}