import { InvoiceGenerator } from "@/components/invoice-generator"
import { Footer } from "@/components/footer"
import Script from "next/script"

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Invoice Generator",
    "description": "Free online invoice generator for small businesses and freelancers. Create professional invoices with customizable themes, automatic calculations, and instant PDF download.",
    "url": "https://white-label-invoice-generator.vercel.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Person",
      "name": "Adeel Imran",
      "url": "https://twitter.com/adeelibr"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Binary Code Barn",
      "email": "contact@binarycodebarn.com"
    },
    "featureList": [
      "Free invoice generation",
      "Professional invoice templates",
      "Customizable themes and branding",
      "Automatic tax and total calculations",
      "Instant PDF download",
      "Multi-currency support",
      "Real-time preview",
      "No registration required",
      "Privacy-focused - data stays in browser"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": ["Small Business Owners", "Freelancers", "Contractors", "Consultants"]
    }
  }

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <main className="min-h-screen bg-background">
        <InvoiceGenerator />
        <Footer />
      </main>
    </>
  )
}
