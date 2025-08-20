import { InvoiceGenerator } from "@/components/invoice-generator"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <InvoiceGenerator />
      <Footer />
    </main>
  )
}
