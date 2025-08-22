import { CRMInvoiceGenerator } from "@/components/crm/crm-invoice-generator"

export const metadata = {
  title: 'Edit Invoice - CRM Dashboard',
  description: 'Edit an existing invoice for your client.',
}

interface EditInvoicePageProps {
  params: Promise<{
    clientId: string
    invoiceId: string
  }>
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { clientId, invoiceId } = await params
  
  return (
    <div className="min-h-screen bg-background">
      <CRMInvoiceGenerator 
        clientId={clientId} 
        invoiceId={invoiceId} 
      />
    </div>
  )
}