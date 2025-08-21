import '@testing-library/jest-dom'

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Inter: () => ({
    style: {
      fontFamily: 'Inter, sans-serif'
    }
  }),
  Playfair_Display: () => ({
    style: {
      fontFamily: 'Playfair Display, serif'
    }
  }),
  Source_Sans_3: () => ({
    style: {
      fontFamily: 'Source Sans 3, sans-serif'
    }
  }),
  Open_Sans: () => ({
    style: {
      fontFamily: 'Open Sans, sans-serif'
    }
  }),
  Crimson_Text: () => ({
    style: {
      fontFamily: 'Crimson Text, serif'
    }
  }),
  Space_Grotesk: () => ({
    style: {
      fontFamily: 'Space Grotesk, sans-serif'
    }
  }),
  Poppins: () => ({
    style: {
      fontFamily: 'Poppins, sans-serif'
    }
  }),
  Nunito: () => ({
    style: {
      fontFamily: 'Nunito, sans-serif'
    }
  }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  }),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.print
Object.defineProperty(window, 'print', {
  value: jest.fn(),
})

// Mock File and FileReader for file upload tests
global.File = class MockFile {
  constructor(parts, name, properties) {
    return {
      name,
      size: properties?.size || 1024,
      type: properties?.type || 'image/png',
      lastModified: Date.now(),
      ...properties
    }
  }
}

global.FileReader = class MockFileReader {
  constructor() {
    this.result = null
    this.onload = null
  }
  
  readAsDataURL(file) {
    setTimeout(() => {
      this.result = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      if (this.onload) {
        this.onload.call(this, {})
      }
    }, 0)
  }
}