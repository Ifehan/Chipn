import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Suppress console errors and logs during tests to keep output clean
// These are intentional application logs that are expected during error scenario tests
const originalError = console.error;
const originalLog = console.log;

beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress application error logs (Login failed, Password reset failed, Signup failed)
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Login failed:') ||
       args[0].includes('Password reset failed:') ||
       args[0].includes('Signup failed:'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.log = (...args: any[]) => {
    // Suppress application success logs (User created successfully)
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

// Mock import.meta for Vite compatibility
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: 'http://localhost:8000',
      },
    },
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;
