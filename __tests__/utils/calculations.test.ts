/**
 * Tests for calculation utilities
 */
import {
  calculateLineItemAmount,
  calculateSubtotal,
  calculateTaxAmount,
  calculateDiscountAmount,
  calculateShippingFee,
  calculateInvoiceTotals,
  formatCurrency,
  validateNumericInput,
  validatePercentageInput,
  roundToDecimals,
  type LineItem
} from '../../lib/calculations'

describe('calculations', () => {
  describe('calculateLineItemAmount', () => {
    it('should calculate correct amount for positive values', () => {
      expect(calculateLineItemAmount('10.50', '2')).toBe(21)
      expect(calculateLineItemAmount('100', '0.5')).toBe(50)
    })

    it('should handle zero values', () => {
      expect(calculateLineItemAmount('0', '5')).toBe(0)
      expect(calculateLineItemAmount('10', '0')).toBe(0)
    })

    it('should handle invalid inputs', () => {
      expect(calculateLineItemAmount('', '5')).toBe(0)
      expect(calculateLineItemAmount('invalid', '5')).toBe(0)
      expect(calculateLineItemAmount('10', 'invalid')).toBe(0)
    })

    it('should handle decimal calculations', () => {
      expect(calculateLineItemAmount('12.75', '1.5')).toBe(19.125)
    })
  })

  describe('calculateSubtotal', () => {
    const mockLineItems: LineItem[] = [
      { id: '1', description: 'Item 1', unitCost: '10', quantity: '2', amount: 20 },
      { id: '2', description: 'Item 2', unitCost: '15', quantity: '1', amount: 15 },
      { id: '3', description: 'Item 3', unitCost: '5', quantity: '3', amount: 15 }
    ]

    it('should calculate correct subtotal', () => {
      expect(calculateSubtotal(mockLineItems)).toBe(50)
    })

    it('should handle empty array', () => {
      expect(calculateSubtotal([])).toBe(0)
    })

    it('should handle items with zero amounts', () => {
      const itemsWithZero: LineItem[] = [
        { id: '1', description: 'Item 1', unitCost: '0', quantity: '0', amount: 0 },
        { id: '2', description: 'Item 2', unitCost: '10', quantity: '1', amount: 10 }
      ]
      expect(calculateSubtotal(itemsWithZero)).toBe(10)
    })
  })

  describe('calculateTaxAmount', () => {
    it('should calculate correct tax amount', () => {
      expect(calculateTaxAmount(100, '10')).toBe(10)
      expect(calculateTaxAmount(100, '8.5')).toBe(8.5)
    })

    it('should handle zero tax rate', () => {
      expect(calculateTaxAmount(100, '0')).toBe(0)
      expect(calculateTaxAmount(100, '')).toBe(0)
    })

    it('should handle invalid tax rate', () => {
      expect(calculateTaxAmount(100, 'invalid')).toBe(0)
    })
  })

  describe('calculateDiscountAmount', () => {
    it('should calculate percentage discount correctly', () => {
      expect(calculateDiscountAmount(100, '10%')).toBe(10)
      expect(calculateDiscountAmount(200, '15%')).toBe(30)
    })

    it('should calculate fixed amount discount correctly', () => {
      expect(calculateDiscountAmount(100, '25')).toBe(25)
      expect(calculateDiscountAmount(100, '50')).toBe(50)
    })

    it('should handle zero discount', () => {
      expect(calculateDiscountAmount(100, '0')).toBe(0)
      expect(calculateDiscountAmount(100, '')).toBe(0)
    })

    it('should handle invalid discount', () => {
      expect(calculateDiscountAmount(100, 'invalid')).toBe(0)
    })
  })

  describe('calculateShippingFee', () => {
    it('should calculate shipping fee correctly', () => {
      expect(calculateShippingFee('15.50')).toBe(15.5)
      expect(calculateShippingFee('0')).toBe(0)
    })

    it('should handle invalid shipping fee', () => {
      expect(calculateShippingFee('')).toBe(0)
      expect(calculateShippingFee('invalid')).toBe(0)
    })
  })

  describe('calculateInvoiceTotals', () => {
    const mockLineItems: LineItem[] = [
      { id: '1', description: 'Item 1', unitCost: '100', quantity: '1', amount: 100 }
    ]

    it('should calculate complete invoice totals', () => {
      const result = calculateInvoiceTotals(mockLineItems, '10', '5', '10')
      
      expect(result.subtotal).toBe(100)
      expect(result.taxAmount).toBe(10)
      expect(result.discountAmount).toBe(5)
      expect(result.shippingFee).toBe(10)
      expect(result.total).toBe(115) // 100 + 10 - 5 + 10
    })

    it('should handle percentage discount', () => {
      const result = calculateInvoiceTotals(mockLineItems, '0', '10%', '0')
      
      expect(result.subtotal).toBe(100)
      expect(result.discountAmount).toBe(10)
      expect(result.total).toBe(90) // 100 - 10
    })

    it('should prevent negative totals', () => {
      const result = calculateInvoiceTotals(mockLineItems, '0', '150', '0')
      
      expect(result.total).toBe(0) // Should not go below 0
    })
  })

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(100)).toBe('$ 100.00')
      expect(formatCurrency(25.5)).toBe('$ 25.50')
      expect(formatCurrency(0)).toBe('$ 0.00')
    })

    it('should handle other currencies', () => {
      expect(formatCurrency(100, 'EUR')).toBe('EUR 100.00')
      expect(formatCurrency(100, 'GBP')).toBe('GBP 100.00')
    })

    it('should handle negative amounts', () => {
      expect(formatCurrency(-25)).toBe('$ -25.00')
    })
  })

  describe('validateNumericInput', () => {
    it('should validate positive numbers', () => {
      expect(validateNumericInput('10')).toBe(true)
      expect(validateNumericInput('10.5')).toBe(true)
      expect(validateNumericInput('0')).toBe(true)
    })

    it('should allow empty input', () => {
      expect(validateNumericInput('')).toBe(true)
      expect(validateNumericInput('   ')).toBe(true)
    })

    it('should reject invalid inputs', () => {
      expect(validateNumericInput('abc')).toBe(false)
      expect(validateNumericInput('-10')).toBe(false)
    })
  })

  describe('validatePercentageInput', () => {
    it('should validate percentage range', () => {
      expect(validatePercentageInput('0')).toBe(true)
      expect(validatePercentageInput('50')).toBe(true)
      expect(validatePercentageInput('100')).toBe(true)
    })

    it('should allow empty input', () => {
      expect(validatePercentageInput('')).toBe(true)
    })

    it('should reject out of range values', () => {
      expect(validatePercentageInput('101')).toBe(false)
      expect(validatePercentageInput('-1')).toBe(false)
    })
  })

  describe('roundToDecimals', () => {
    it('should round to specified decimal places', () => {
      expect(roundToDecimals(10.123456, 2)).toBe(10.12)
      expect(roundToDecimals(10.126, 2)).toBe(10.13)
      expect(roundToDecimals(10.5, 0)).toBe(11)
    })

    it('should handle default decimal places', () => {
      expect(roundToDecimals(10.123456)).toBe(10.12)
    })

    it('should handle whole numbers', () => {
      expect(roundToDecimals(10)).toBe(10)
    })
  })
})