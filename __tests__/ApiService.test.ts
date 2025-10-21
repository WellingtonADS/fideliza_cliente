import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api, { login, registerClient, getClientDashboard, setBaseURL } from '../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('API service (cliente)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  test('usa baseURL local quando em dev', () => {
    // Garante que podemos trocar a base URL em tempo de teste
    setBaseURL('http://10.0.2.2:8000/api/v1');
    // @ts-ignore acessar config privada do axios instance
    expect(api.defaults.baseURL).toContain('10.0.2.2');
  });

  test('login envia form-urlencoded para /token', async () => {
    setBaseURL('http://10.0.2.2:8000/api/v1');
    mock.onPost('/token').reply((config) => {
      // valida content-type
      expect(config.headers?.['Content-Type']).toBe('application/x-www-form-urlencoded');
      // valida body
      expect(config.data).toContain('username=');
      expect(config.data).toContain('password=');
      return [200, { access_token: 'abc', token_type: 'bearer' }];
    });

    const res = await login({ email: 'u@test.com', password: 'Senha1234' });
    expect(res.status).toBe(200);
    expect(res.data.access_token).toBe('abc');
  });

  test('registro chama /register/client/ com JSON', async () => {
    setBaseURL('http://10.0.2.2:8000/api/v1');
    mock.onPost('/register/client/').reply((config) => {
      const body = JSON.parse(config.data);
      expect(body.email).toBe('c@test.com');
      expect(body.password).toBe('Senha1234');
      return [201, { id: 1, qr_code_base64: 'BASE64PNG' }];
    });
    const res = await registerClient({ email: 'c@test.com', password: 'Senha1234', name: 'Cliente' });
    expect(res.status).toBe(201);
  });

  test('dashboard GET /dashboard com 200', async () => {
    setBaseURL('http://10.0.2.2:8000/api/v1');
    mock.onGet('/dashboard').reply(200, { total_points: 3, last_activity: null, qr_code_base64: null });
    const data = await getClientDashboard();
    expect(data.total_points).toBe(3);
  });

  test('interceptor injeta Authorization se token no AsyncStorage', async () => {
    setBaseURL('http://10.0.2.2:8000/api/v1');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('XYZ');

    mock.onGet('/users/me').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer XYZ');
      return [200, { id: 1, email: 'u@test.com' }];
    });

    const res = await api.get('/users/me');
    expect(res.status).toBe(200);
  });
});
