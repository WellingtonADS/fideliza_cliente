// src/types/dashboard.ts

// Interface para a informação da empresa dentro da última atividade
interface CompanyInfo {
  id: number;
  name: string;
}

// Interface para a última transação de pontos
interface LastActivity {
  id: number;
  points: number;
  created_at: string;
  company: CompanyInfo; // A API retorna o objeto da empresa aninhado
}

// Interface principal para os dados do Dashboard
export interface DashboardData {
  total_points: number;
  last_activity: LastActivity | null;
  qr_code_base64: string | null;
}

// Adiciona a interface RewardStatus para corrigir o erro na tela de prêmios
export interface RewardStatus {
  id: number;
  name: string;
  description: string;
  points_required: number;
  redeemable: boolean;
  points_to_redeem: number;
}
