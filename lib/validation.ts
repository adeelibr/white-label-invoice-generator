/**
 * Form validation utilities for invoice inputs
 * Provides comprehensive validation with helpful error messages
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  return { isValid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: true }; // Allow empty email
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate numeric input
 */
export function validateNumeric(value: string, fieldName: string, min: number = 0, max?: number): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: true }; // Allow empty numeric fields
  }
  
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`
    };
  }
  
  if (num < min) {
    return {
      isValid: false,
      error: `${fieldName} cannot be less than ${min}`
    };
  }
  
  if (max !== undefined && num > max) {
    return {
      isValid: false,
      error: `${fieldName} cannot be greater than ${max}`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate percentage (0-100)
 */
export function validatePercentage(value: string, fieldName: string): ValidationResult {
  return validateNumeric(value, fieldName, 0, 100);
}

/**
 * Validate invoice number format
 */
export function validateInvoiceNumber(invoiceNumber: string): ValidationResult {
  if (!invoiceNumber || invoiceNumber.trim() === '') {
    return {
      isValid: false,
      error: 'Invoice number is required'
    };
  }
  
  // Allow alphanumeric characters, hyphens, and underscores
  const invoiceRegex = /^[a-zA-Z0-9_-]+$/;
  if (!invoiceRegex.test(invoiceNumber)) {
    return {
      isValid: false,
      error: 'Invoice number can only contain letters, numbers, hyphens, and underscores'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate date format and future date validation
 */
export function validateDate(dateString: string, fieldName: string, allowPast: boolean = true): ValidationResult {
  if (!dateString || dateString.trim() === '') {
    return { isValid: true }; // Allow empty dates
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid date`
    };
  }
  
  if (!allowPast && date < new Date()) {
    return {
      isValid: false,
      error: `${fieldName} cannot be in the past`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate due date is after invoice date
 */
export function validateDueDateAfterInvoiceDate(invoiceDate: string, dueDate: string): ValidationResult {
  if (!invoiceDate || !dueDate) {
    return { isValid: true }; // Skip validation if either date is empty
  }
  
  const invoiceDateObj = new Date(invoiceDate);
  const dueDateObj = new Date(dueDate);
  
  if (dueDateObj < invoiceDateObj) {
    return {
      isValid: false,
      error: 'Due date must be after invoice date'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate file upload (logo)
 */
export function validateFileUpload(file: File): ValidationResult {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 5MB'
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a JPG, JPEG, or PNG file'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate line item description
 */
export function validateDescription(description: string): ValidationResult {
  if (!description || description.trim() === '') {
    return {
      isValid: false,
      error: 'Description is required'
    };
  }
  
  if (description.length > 200) {
    return {
      isValid: false,
      error: 'Description cannot exceed 200 characters'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate that at least one line item exists
 */
export function validateLineItems(lineItems: Array<{ description: string; unitCost: string; quantity: string }>): ValidationResult {
  if (!lineItems || lineItems.length === 0) {
    return {
      isValid: false,
      error: 'At least one line item is required'
    };
  }
  
  // Check if at least one line item has valid data
  const hasValidItem = lineItems.some(item => 
    item.description.trim() !== '' || 
    (item.unitCost.trim() !== '' && parseFloat(item.unitCost) > 0) ||
    (item.quantity.trim() !== '' && parseFloat(item.quantity) > 0)
  );
  
  if (!hasValidItem) {
    return {
      isValid: false,
      error: 'At least one line item must have valid data'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate entire invoice form
 */
export function validateInvoiceForm(formData: {
  invoiceNumber: string;
  companyDetails: string;
  billTo: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: Array<{ description: string; unitCost: string; quantity: string }>;
  taxRate: string;
  discount: string;
  shippingFee: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};
  
  // Validate required fields
  const invoiceNumberValidation = validateInvoiceNumber(formData.invoiceNumber);
  if (!invoiceNumberValidation.isValid) {
    errors.invoiceNumber = invoiceNumberValidation.error!;
  }
  
  const companyValidation = validateRequired(formData.companyDetails, 'Company details');
  if (!companyValidation.isValid) {
    errors.companyDetails = companyValidation.error!;
  }
  
  const billToValidation = validateRequired(formData.billTo, 'Bill to');
  if (!billToValidation.isValid) {
    errors.billTo = billToValidation.error!;
  }
  
  // Validate dates
  const invoiceDateValidation = validateDate(formData.invoiceDate, 'Invoice date');
  if (!invoiceDateValidation.isValid) {
    errors.invoiceDate = invoiceDateValidation.error!;
  }
  
  const dueDateValidation = validateDate(formData.dueDate, 'Due date');
  if (!dueDateValidation.isValid) {
    errors.dueDate = dueDateValidation.error!;
  }
  
  const dueDateAfterValidation = validateDueDateAfterInvoiceDate(formData.invoiceDate, formData.dueDate);
  if (!dueDateAfterValidation.isValid) {
    errors.dueDate = dueDateAfterValidation.error!;
  }
  
  // Validate line items
  const lineItemsValidation = validateLineItems(formData.lineItems);
  if (!lineItemsValidation.isValid) {
    errors.lineItems = lineItemsValidation.error!;
  }
  
  // Validate numeric fields
  const taxValidation = validatePercentage(formData.taxRate, 'Tax rate');
  if (!taxValidation.isValid) {
    errors.taxRate = taxValidation.error!;
  }
  
  const discountValidation = validateNumeric(formData.discount, 'Discount');
  if (!discountValidation.isValid) {
    errors.discount = discountValidation.error!;
  }
  
  const shippingValidation = validateNumeric(formData.shippingFee, 'Shipping fee');
  if (!shippingValidation.isValid) {
    errors.shippingFee = shippingValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}