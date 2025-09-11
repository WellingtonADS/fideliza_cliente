try { require('react-native-gesture-handler/jestSetup'); } catch (_) {}

jest.mock('react-native-gesture-handler', () => {
  try {
    const Actual = jest.requireActual('react-native-gesture-handler');
    return { ...Actual, GestureHandlerRootView: ({ children }) => children };
  } catch {
    return { GestureHandlerRootView: ({ children }) => children };
  }
});

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    setItem: jest.fn((k, v) => { store[k] = v; return Promise.resolve(); }),
    getItem: jest.fn(k => Promise.resolve(store[k] ?? null)),
    removeItem: jest.fn(k => { delete store[k]; return Promise.resolve(); }),
    clear: jest.fn(() => { store = {}; return Promise.resolve(); }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  };
});

jest.mock('react-native-splash-screen', () => ({ hide: jest.fn(), show: jest.fn() }));

// Suprimir warnings específicos, se aparecerem
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes('deprecated')) return;
  originalWarn(...args);
};
