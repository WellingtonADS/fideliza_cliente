// src/types/points.ts

export interface UserInfo {
  id: number;
  name: string;
}

export interface PointTransaction {
  id: number;
  points: number; // <--- CORREÇÃO APLICADA AQUI
  created_at: string;
  client?: UserInfo;
  awarded_by?: UserInfo;
  // Removidos campos duplicados ou desnecessários como 'timestamp' e 'transaction_type'
}

export interface CompanyPoints {
  company_id: number;
  company_name: string;
  points_balance: number;
}