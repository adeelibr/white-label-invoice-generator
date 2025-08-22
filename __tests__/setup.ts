/**
 * Jest setup file
 */

// Setup for jsdom environment
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Suppress console.error and console.warn in tests unless needed
  error: jest.fn(),
  warn: jest.fn(),
}