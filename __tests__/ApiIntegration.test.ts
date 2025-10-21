import axios from 'axios';

// Testes de integração REAL contra o backend local.
// Pré-requisito: backend rodando em http://127.0.0.1:8000 (uvicorn)

const BASE_URL = 'http://127.0.0.1:8000/api/v1';

describe('Integração real com backend local', () => {
  const client = axios.create({ baseURL: BASE_URL, headers: { 'X-Test-Id': 'rn-integration' } });

  it('registra cliente, faz login e acessa dashboard', async () => {
    const email = `rn_it_${Date.now()}@test.com`;
    const password = 'Senha1234';
    const name = 'RN IT';

    // 1) Registro de cliente
    const reg = await client.post('/register/client/', { email, password, name });
    expect(reg.status).toBe(201);
    expect(reg.data).toHaveProperty('id');
    expect(reg.data).toHaveProperty('qr_code_base64');

    // 2) Login (token)
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    const tok = await client.post('/token', form.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    expect(tok.status).toBe(200);
    const token = tok.data.access_token as string;
    expect(token).toBeTruthy();

    // 3) Dashboard do cliente
    const me = axios.create({ baseURL: BASE_URL, headers: { Authorization: `Bearer ${token}`, 'X-Test-Id': 'rn-integration' } });
    const dash = await me.get('/dashboard');
    expect(dash.status).toBe(200);
    expect(dash.data).toHaveProperty('total_points');
  });
});
