// src/types/points.ts

export interface PointTransaction {
  id: number;
  points_added: number;
  transaction_type: 'scan' | 'reward_redeem' | 'manual_add';
  timestamp: string; // Formato ISO 8601 (e.g., "2023-10-27T10:00:00")
  collaborator_name?: string; // Nome do colaborador que realizou a transação
}

export interface CompanyPoints {
  company_id: number;
  company_name: string;
  points_balance: number;
}