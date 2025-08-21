import { CRMInvoiceGenerator } from "@/components/crm/crm-invoice-generator"

export const metadata = {
  title: 'New Invoice - CRM Dashboard',
  description: 'Create a new invoice for your client.',
}

interface NewInvoicePageProps {
  params: {
    clientId: string
  }
}

export default function NewInvoicePage({ params }: NewInvoicePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <CRMInvoiceGenerator clientId={params.clientId} />
    </div>
  )
}