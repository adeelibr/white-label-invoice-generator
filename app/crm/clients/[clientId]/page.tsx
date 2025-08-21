import { ClientOverview } from "@/components/crm/client-overview"

export const metadata = {
  title: 'Client Overview - CRM Dashboard',
  description: 'View client details and manage their invoices.',
}

interface ClientPageProps {
  params: {
    clientId: string
  }
}

export default function ClientPage({ params }: ClientPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <ClientOverview clientId={params.clientId} />
    </div>
  )
}