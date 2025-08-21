/**
 * Calculation utilities for invoice totals, tax, discounts, and validation
 * Provides type-safe calculation functions with proper error handling
 */

export interface LineItem {
  id: string;
  description: string;
  unitCost: string;
  quantity: string;
  amount: number;
}

export interface InvoiceCalculations {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
}

/**
 * Calculate line item amount (unitCost * quantity)
 */
export function calculateLineItemAmount(unitCost: string, quantity: string): number {
  const cost = parseFloat(unitCost) || 0;
  const qty = parseFloat(quantity) || 0;
  return cost * qty;
}

/**
 * Calculate subtotal from all line items
 */
export function calculateSubtotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Calculate tax amount from subtotal and tax rate
 */
export function calculateTaxAmount(subtotal: number, taxRate: string): number {
  const rate = parseFloat(taxRate) || 0;
  return (subtotal * rate) / 100;
}

/**
 * Calculate discount amount (either percentage or fixed amount)
 */
export function calculateDiscountAmount(subtotal: number, discount: string): number {
  const discountValue = parseFloat(discount) || 0;
  
  // If discount contains '%', treat as percentage
  if (discount.includes('%')) {
    return (subtotal * discountValue) / 100;
  }
  
  // Otherwise treat as fixed amount
  return discountValue;
}

/**
 * Calculate shipping fee
 */
export function calculateShippingFee(shippingFee: string): number {
  return parseFloat(shippingFee) || 0;
}

/**
 * Calculate all invoice totals
 */
export function calculateInvoiceTotals(
  lineItems: LineItem[],
  taxRate: string,
  discount: string,
  shippingFee: string
): InvoiceCalculations {
  const subtotal = calculateSubtotal(lineItems);
  const taxAmount = calculateTaxAmount(subtotal, taxRate);
  const discountAmount = calculateDiscountAmount(subtotal, discount);
  const shipping = calculateShippingFee(shippingFee);
  
  const total = Math.max(0, subtotal + taxAmount - discountAmount + shipping);
  
  return {
    subtotal,
    taxAmount,
    discountAmount,
    shippingFee: shipping,
    total
  };
}

/**
 * Format currency value with proper decimal places
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbol = currency === 'USD' ? '$' : currency;
  return `${currencySymbol} ${amount.toFixed(2)}`;
}

/**
 * Validate numeric input for calculations
 */
export function validateNumericInput(value: string): boolean {
  if (!value || value.trim() === '') return true; // Allow empty
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

/**
 * Validate percentage input (0-100)
 */
export function validatePercentageInput(value: string): boolean {
  if (!value || value.trim() === '') return true; // Allow empty
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0 && num <= 100;
}

/**
 * Round to specified decimal places
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}