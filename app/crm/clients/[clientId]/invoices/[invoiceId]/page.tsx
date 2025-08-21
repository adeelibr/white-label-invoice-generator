import { CRMInvoiceGenerator } from "@/components/crm/crm-invoice-generator"

export const metadata = {
  title: 'Edit Invoice - CRM Dashboard',
  description: 'Edit an existing invoice for your client.',
}

interface EditInvoicePageProps {
  params: {
    clientId: string
    invoiceId: string
  }
}

export default function EditInvoicePage({ params }: EditInvoicePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <CRMInvoiceGenerator 
        clientId={params.clientId} 
        invoiceId={params.invoiceId} 
      />
    </div>
  )
}