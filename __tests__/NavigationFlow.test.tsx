// Arquivo LIMPO: teste reduzido e estável de fluxo de navegação
// Função utilitária para limitar profundidade da árvore renderizada
function limitDepth(node: any, depth: number = 0, maxDepth: number = 6): any {
  if (depth > maxDepth) return '[...]';
  if (node == null || typeof node === 'string' || typeof node === 'number') return node;
  if (Array.isArray(node)) return node.map(child => limitDepth(child, depth + 1, maxDepth));
  if (typeof node === 'object') {
    const { children, ...rest } = node;
    return { ...rest, children: limitDepth(children, depth + 1, maxDepth) };
  }
  return node;
}
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigation/AppNavigator';
import { AuthContext } from '../src/context/AuthContext';

jest.mock('../src/services/api'); // usa __mocks__/src/services/api.ts

interface MockAuthValue {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  signIn: jest.Mock;
  signUp: jest.Mock;
  signOut: jest.Mock;
  refreshUser: jest.Mock;
}

function sanitize(node: any): any {
  if (node == null) return node;
  if (typeof node === 'string' || typeof node === 'number') return node;
  if (Array.isArray(node)) return node.map(sanitize);
  if (typeof node === 'object') {
    const { props, children, ...rest } = node as any;
    const newProps = { ...(props || {}) };
    if ('screenId' in newProps) delete newProps.screenId;
    return { ...rest, props: newProps, children: sanitize(children) };
  }
  return node;
}

async function renderWith(value: MockAuthValue) {
  let tree: TestRenderer.ReactTestRenderer | undefined;
  await TestRenderer.act(async () => {
    tree = TestRenderer.create(
      <AuthContext.Provider value={value as any}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthContext.Provider>
    );
  });
  await TestRenderer.act(async () => { await Promise.resolve(); });
  return tree!;
}

describe('NavigationFlow', () => {
  const baseValue: MockAuthValue = {
    token: null,
    user: null,
    isLoading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    refreshUser: jest.fn(),
  };

  it('mostra telas de autenticação quando não logado', async () => {
      const tree = await renderWith(baseValue);
      const sanitized = sanitize(tree.toJSON());
      // Limita profundidade para evitar snapshots gigantes
      expect(limitDepth(sanitized)).toMatchSnapshot();
  });

  it('mostra fluxo principal quando logado', async () => {
      const tree = await renderWith({
        ...baseValue,
        token: 'token',
        user: { id: 1, name: 'User', email: 'user@test.com' },
      });
      const sanitized = sanitize(tree.toJSON());
      expect(limitDepth(sanitized)).toMatchSnapshot();
  });
});
