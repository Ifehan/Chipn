import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { vi } from 'vitest';

// localStorage mock for jsdom environments
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => { store[key] = String(value); },
    removeItem: (key: string): void => { delete store[key]; },
    clear: (): void => { store = {}; },
    key: (index: number): string | null => Object.keys(store)[index] ?? null,
    get length(): number { return Object.keys(store).length; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

const originalError = console.error;
const originalLog = console.log;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Login failed:') ||
       args[0].includes('Password reset failed:') ||
       args[0].includes('Signup failed:'))
    ) {
      return;
    }

    const errorMessage = (args[0] as Error)?.message || String(args[0]);
    if (errorMessage.includes('Not implemented: navigation')) {
      return;
    }

    originalError.call(console, ...args);
  };

  console.log = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('User created successfully:')
    ) {
      return;
    }
    originalLog.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.log = originalLog;
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof ResizeObserver;
