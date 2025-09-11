// Mapeamento centralizado de ícones FontAwesome para chaves semânticas do app
// Mantém alinhamento com o padrão do fideliza_gestao (FontAwesome) e facilita futuras trocas.

export type AppIconKey =
  | 'home'
  | 'login'
  | 'register'
  | 'recoverPassword'
  | 'resetPassword'
  | 'companies'
  | 'pointHistory'
  | 'pointDetail'
  | 'rewards';

export const AppIcons: Record<AppIconKey, string> = {
  home: 'home',
  login: 'sign-in',
  register: 'user-plus',
  recoverPassword: 'unlock-alt',
  resetPassword: 'lock',
  companies: 'building',
  pointHistory: 'history',
  pointDetail: 'list-alt',
  rewards: 'gift',
};
