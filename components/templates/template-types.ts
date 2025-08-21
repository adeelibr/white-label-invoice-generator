import type { ThemeConfig } from "../theme-settings"

export interface LineItem {
  id: string
  description: string
  unitCost: string
  quantity: string
  amount: number
}

export interface InvoiceData {
  invoiceNumber: string
  purchaseOrder: string
  logo: string
  companyDetails: string
  billTo: string
  currency: string
  invoiceDate: string
  dueDate: string
  lineItems: LineItem[]
  notes: string
  bankDetails: string
  subtotal: number
  taxRate: string
  discount: string
  shippingFee: string
  total: number
}

export interface InvoiceTemplateProps {
  data: InvoiceData
  theme?: ThemeConfig
}

export type TemplateType = 
  | "classic" 
  | "modern" 
  | "professional" 
  | "creative" 
  | "minimal" 
  | "elegant" 
  | "bold"

export interface TemplateConfig {
  id: TemplateType
  name: string
  description: string
  preview: string
}