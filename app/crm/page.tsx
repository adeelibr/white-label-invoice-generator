import { ClientsDirectory } from "@/components/crm/clients-directory"

export const metadata = {
  title: 'Clients & Invoices - CRM Dashboard',
  description: 'Manage your clients and their invoices in one place. Local-first CRM for freelancers and small businesses.',
  keywords: [
    'CRM',
    'client management', 
    'invoice management',
    'freelancer CRM',
    'small business CRM',
    'local CRM',
    'offline CRM'
  ],
  openGraph: {
    title: 'Clients & Invoices - CRM Dashboard',
    description: 'Manage your clients and their invoices in one place. Local-first CRM for freelancers and small businesses.',
    type: 'website',
  },
}

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-background">
      <ClientsDirectory />
    </div>
  )
}