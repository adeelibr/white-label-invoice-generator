import { ClientOverview } from "@/components/crm/client-overview"

export const metadata = {
  title: 'Client Overview - CRM Dashboard',
  description: 'View client details and manage their invoices.',
}

interface ClientPageProps {
  params: Promise<{
    clientId: string
  }>
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { clientId } = await params
  
  return (
    <div className="min-h-screen bg-background">
      <ClientOverview clientId={clientId} />
    </div>
  )
}