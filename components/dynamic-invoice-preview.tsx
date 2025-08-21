import type { InvoiceTemplateProps, TemplateType } from "./templates"
import { 
  ClassicTemplate,
  ModernTemplate,
  ProfessionalTemplate, 
  CreativeTemplate,
  MinimalTemplate,
  ElegantTemplate,
  BoldTemplate
} from "./templates"

interface DynamicInvoicePreviewProps extends InvoiceTemplateProps {
  template: TemplateType
}

export function DynamicInvoicePreview({ template, ...props }: DynamicInvoicePreviewProps) {
  const templateComponents = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
    minimal: MinimalTemplate,
    elegant: ElegantTemplate,
    bold: BoldTemplate,
  }
  
  const TemplateComponent = templateComponents[template] || ClassicTemplate
  
  return <TemplateComponent {...props} />
}