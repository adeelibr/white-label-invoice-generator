import { CRMInvoiceGenerator } from "@/components/crm/crm-invoice-generator"

export const metadata = {
  title: 'New Invoice - CRM Dashboard',
  description: 'Create a new invoice for your client.',
}

interface NewInvoicePageProps {
  params: Promise<{
    clientId: string
  }>
}

export default async function NewInvoicePage({ params }: NewInvoicePageProps) {
  const { clientId } = await params
  
  return (
    <div className="min-h-screen bg-background">
      <CRMInvoiceGenerator clientId={clientId} />
    </div>
  )
}