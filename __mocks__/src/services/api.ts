// Mock centralizado de '../src/services/api'
// Evita duplicação de mocks em arquivos de teste individuais.

export const login = jest.fn(() => Promise.resolve({ data: { access_token: 'mock-token' } }));
export const getMyProfile = jest.fn(() => Promise.resolve({ data: { id: 1, name: 'User', email: 'user@test.com' } }));
export const getClientDashboard = jest.fn(() => Promise.resolve({
  total_points: 0,
  last_activity: null,
  qr_code_base64: null,
}));
export const getMyRewardsStatus = jest.fn(() => Promise.resolve({ data: [] }));
export const redeemReward = jest.fn(() => Promise.resolve({ data: {} }));
export const updateMyProfile = jest.fn(() => Promise.resolve({ data: {} }));
export const setAuthToken = jest.fn();

export default {
  login,
  getMyProfile,
  getClientDashboard,
  getMyRewardsStatus,
  redeemReward,
  updateMyProfile,
  setAuthToken,
};
