/**
 * Tests for validation utilities
 */
import {
  validateRequired,
  validateEmail,
  validateNumeric,
  validatePercentage,
  validateInvoiceNumber,
  validateDate,
  validateDueDateAfterInvoiceDate,
  validateFileUpload,
  validateDescription,
  validateLineItems,
  validateInvoiceForm
} from '../../lib/validation'

describe('validation', () => {
  describe('validateRequired', () => {
    it('should pass for non-empty values', () => {
      const result = validateRequired('test value', 'Test Field')
      expect(result.isValid).toBe(true)
    })

    it('should fail for empty values', () => {
      const result = validateRequired('', 'Test Field')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Test Field is required')
    })

    it('should fail for whitespace-only values', () => {
      const result = validateRequired('   ', 'Test Field')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Test Field is required')
    })
  })

  describe('validateEmail', () => {
    it('should pass for valid email addresses', () => {
      expect(validateEmail('test@example.com').isValid).toBe(true)
      expect(validateEmail('user.name@domain.co.uk').isValid).toBe(true)
    })

    it('should allow empty email', () => {
      expect(validateEmail('').isValid).toBe(true)
    })

    it('should fail for invalid email formats', () => {
      const result = validateEmail('invalid-email')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please enter a valid email address')
    })

    it('should fail for emails without domain', () => {
      const result = validateEmail('test@')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please enter a valid email address')
    })
  })

  describe('validateNumeric', () => {
    it('should pass for valid numbers', () => {
      expect(validateNumeric('10', 'Amount').isValid).toBe(true)
      expect(validateNumeric('10.5', 'Amount').isValid).toBe(true)
    })

    it('should allow empty values', () => {
      expect(validateNumeric('', 'Amount').isValid).toBe(true)
    })

    it('should fail for non-numeric values', () => {
      const result = validateNumeric('abc', 'Amount')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount must be a valid number')
    })

    it('should enforce minimum value', () => {
      const result = validateNumeric('-5', 'Amount', 0)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount cannot be less than 0')
    })

    it('should enforce maximum value', () => {
      const result = validateNumeric('150', 'Amount', 0, 100)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount cannot be greater than 100')
    })
  })

  describe('validatePercentage', () => {
    it('should pass for valid percentages', () => {
      expect(validatePercentage('50', 'Tax Rate').isValid).toBe(true)
      expect(validatePercentage('0', 'Tax Rate').isValid).toBe(true)
      expect(validatePercentage('100', 'Tax Rate').isValid).toBe(true)
    })

    it('should fail for out-of-range values', () => {
      const result = validatePercentage('101', 'Tax Rate')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Tax Rate cannot be greater than 100')
    })
  })

  describe('validateInvoiceNumber', () => {
    it('should pass for valid invoice numbers', () => {
      expect(validateInvoiceNumber('INV-001').isValid).toBe(true)
      expect(validateInvoiceNumber('2024_001').isValid).toBe(true)
      expect(validateInvoiceNumber('ABC123').isValid).toBe(true)
    })

    it('should fail for empty invoice numbers', () => {
      const result = validateInvoiceNumber('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invoice number is required')
    })

    it('should fail for invalid characters', () => {
      const result = validateInvoiceNumber('INV@001')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invoice number can only contain letters, numbers, hyphens, and underscores')
    })
  })

  describe('validateDate', () => {
    it('should pass for valid dates', () => {
      expect(validateDate('2024-01-01', 'Invoice Date').isValid).toBe(true)
      expect(validateDate('12/31/2024', 'Due Date').isValid).toBe(true)
    })

    it('should allow empty dates', () => {
      expect(validateDate('', 'Due Date').isValid).toBe(true)
    })

    it('should fail for invalid dates', () => {
      const result = validateDate('invalid-date', 'Invoice Date')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invoice Date must be a valid date')
    })

    it('should validate future dates when allowPast is false', () => {
      const pastDate = '2020-01-01'
      const result = validateDate(pastDate, 'Due Date', false)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Due Date cannot be in the past')
    })
  })

  describe('validateDueDateAfterInvoiceDate', () => {
    it('should pass when due date is after invoice date', () => {
      const result = validateDueDateAfterInvoiceDate('2024-01-01', '2024-01-15')
      expect(result.isValid).toBe(true)
    })

    it('should fail when due date is before invoice date', () => {
      const result = validateDueDateAfterInvoiceDate('2024-01-15', '2024-01-01')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Due date must be after invoice date')
    })

    it('should pass when either date is empty', () => {
      expect(validateDueDateAfterInvoiceDate('', '2024-01-15').isValid).toBe(true)
      expect(validateDueDateAfterInvoiceDate('2024-01-01', '').isValid).toBe(true)
    })
  })

  describe('validateFileUpload', () => {
    it('should pass for valid image files', () => {
      const validFile = new File([''], 'image.png', { type: 'image/png', size: 1024 })
      expect(validateFileUpload(validFile).isValid).toBe(true)
    })

    it('should fail for files that are too large', () => {
      const largeFile = new File([''], 'large.png', { 
        type: 'image/png', 
        size: 6 * 1024 * 1024 // 6MB
      })
      const result = validateFileUpload(largeFile)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('File size must be less than 5MB')
    })

    it('should fail for invalid file types', () => {
      const invalidFile = new File([''], 'document.pdf', { type: 'application/pdf' })
      const result = validateFileUpload(invalidFile)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please upload a JPG, JPEG, or PNG file')
    })
  })

  describe('validateDescription', () => {
    it('should pass for valid descriptions', () => {
      expect(validateDescription('Web development services').isValid).toBe(true)
    })

    it('should fail for empty descriptions', () => {
      const result = validateDescription('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Description is required')
    })

    it('should fail for descriptions that are too long', () => {
      const longDescription = 'A'.repeat(201)
      const result = validateDescription(longDescription)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Description cannot exceed 200 characters')
    })
  })

  describe('validateLineItems', () => {
    it('should pass for valid line items', () => {
      const lineItems = [
        { description: 'Web development', unitCost: '100', quantity: '1' }
      ]
      expect(validateLineItems(lineItems).isValid).toBe(true)
    })

    it('should fail for empty array', () => {
      const result = validateLineItems([])
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('At least one line item is required')
    })

    it('should fail when no items have valid data', () => {
      const lineItems = [
        { description: '', unitCost: '', quantity: '' }
      ]
      const result = validateLineItems(lineItems)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('At least one line item must have valid data')
    })
  })

  describe('validateInvoiceForm', () => {
    const validFormData = {
      invoiceNumber: 'INV-001',
      companyDetails: 'My Company\n123 Main St',
      billTo: 'Client Name\n456 Oak St',
      invoiceDate: '2024-01-01',
      dueDate: '2024-01-15',
      lineItems: [
        { description: 'Web development', unitCost: '100', quantity: '1' }
      ],
      taxRate: '10',
      discount: '5',
      shippingFee: '0'
    }

    it('should pass for valid form data', () => {
      const result = validateInvoiceForm(validFormData)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should fail for missing required fields', () => {
      const invalidFormData = {
        ...validFormData,
        invoiceNumber: '',
        companyDetails: ''
      }
      const result = validateInvoiceForm(invalidFormData)
      expect(result.isValid).toBe(false)
      expect(result.errors.invoiceNumber).toBeDefined()
      expect(result.errors.companyDetails).toBeDefined()
    })

    it('should validate date consistency', () => {
      const invalidFormData = {
        ...validFormData,
        invoiceDate: '2024-01-15',
        dueDate: '2024-01-01' // Due date before invoice date
      }
      const result = validateInvoiceForm(invalidFormData)
      expect(result.isValid).toBe(false)
      expect(result.errors.dueDate).toBeDefined()
    })

    it('should validate numeric fields', () => {
      const invalidFormData = {
        ...validFormData,
        taxRate: '101', // Over 100%
        discount: 'invalid'
      }
      const result = validateInvoiceForm(invalidFormData)
      expect(result.isValid).toBe(false)
      expect(result.errors.taxRate).toBeDefined()
      expect(result.errors.discount).toBeDefined()
    })
  })
})