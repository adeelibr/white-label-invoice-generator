/**
 * Tests for hooks index file exports
 */

describe('hooks index exports', () => {
  test('should export all hooks correctly', () => {
    const hooks = require('../../../lib/hooks')
    
    // Verify all hook functions are exported
    expect(typeof hooks.useTheme).toBe('function')
    expect(typeof hooks.useClient).toBe('function')  
    expect(typeof hooks.useInvoice).toBe('function')
    expect(typeof hooks.useModal).toBe('function')
    expect(typeof hooks.useTypedModal).toBe('function')
  })

  test('should not export undefined hooks', () => {
    const hooks = require('../../../lib/hooks')
    
    // All exports should be defined
    expect(hooks.useTheme).toBeDefined()
    expect(hooks.useClient).toBeDefined()  
    expect(hooks.useInvoice).toBeDefined()
    expect(hooks.useModal).toBeDefined()
    expect(hooks.useTypedModal).toBeDefined()
    
    // No undefined exports
    Object.values(hooks).forEach(hook => {
      expect(hook).toBeDefined()
    })
  })
})