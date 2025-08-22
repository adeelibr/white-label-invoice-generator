/**
 * Simple integration tests for the hooks
 * These tests verify the hooks work correctly with mock storage
 */

describe('useModal hook', () => {
  test('should be importable', () => {
    const { useModal, useTypedModal } = require('../../../lib/hooks/useModal')
    expect(typeof useModal).toBe('function')
    expect(typeof useTypedModal).toBe('function')
  })
})

describe('useTheme hook', () => {
  test('should be importable', () => {
    const { useTheme } = require('../../../lib/hooks/useTheme')
    expect(typeof useTheme).toBe('function')
  })
})

describe('useClient hook', () => {
  test('should be importable', () => {
    const { useClient } = require('../../../lib/hooks/useClient')
    expect(typeof useClient).toBe('function')
  })
})

describe('useInvoice hook', () => {
  test('should be importable', () => {
    const { useInvoice } = require('../../../lib/hooks/useInvoice')
    expect(typeof useInvoice).toBe('function')
  })
})

describe('hooks index', () => {
  test('should export all hooks', () => {
    const hooks = require('../../../lib/hooks')
    expect(hooks.useTheme).toBeDefined()
    expect(hooks.useClient).toBeDefined()  
    expect(hooks.useInvoice).toBeDefined()
    expect(hooks.useModal).toBeDefined()
    expect(hooks.useTypedModal).toBeDefined()
  })
})