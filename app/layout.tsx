import type React from "react"
import type { Metadata } from "next"
import {
  Playfair_Display,
  Source_Sans_3,
  Inter,
  Open_Sans,
  Crimson_Text,
  Space_Grotesk,
  Poppins,
  Nunito,
} from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "500", "600"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-opensans",
  weight: ["400", "500", "600"],
})

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crimson",
  weight: ["400", "600", "700"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-spacegrotesk",
  weight: ["400", "500", "600", "700"],
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
})

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://white-label-invoice-generator.vercel.app'),
  title: {
    default: "Free Invoice Generator - Create Professional Invoices Online",
    template: "%s | Free Invoice Generator"
  },
  description: "Free online invoice generator for small businesses and freelancers. Create professional invoices with customizable themes, automatic calculations, and instant PDF download. No registration required.",
  keywords: [
    "free invoice generator",
    "online invoice creator",
    "professional invoices",
    "small business invoicing",
    "freelancer invoice tool",
    "PDF invoice maker",
    "invoice template",
    "business invoice generator",
    "custom invoice creator",
    "invoice maker online"
  ],
  authors: [{ name: "Adeel Imran", url: "https://twitter.com/adeelibr" }],
  creator: "Adeel Imran",
  publisher: "Binary Code Barn",
  generator: "Next.js",
  applicationName: "Free Invoice Generator",
  referrer: "origin-when-cross-origin",
  category: "Business Tools",
  classification: "Invoice Generator",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Free Invoice Generator - Create Professional Invoices Online",
    description: "Create professional invoices instantly with our free online invoice generator. Perfect for small businesses and freelancers. No registration required - download PDF invoices immediately.",
    siteName: "Free Invoice Generator",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Free Invoice Generator - Create Professional Invoices Online",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@adeelibr",
    creator: "@adeelibr",
    title: "Free Invoice Generator - Create Professional Invoices Online",
    description: "Create professional invoices instantly with our free online invoice generator. Perfect for small businesses and freelancers.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token_here", // Replace with actual Google Search Console verification token when available
  },
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSans.variable} ${inter.variable} ${openSans.variable} ${crimsonText.variable} ${spaceGrotesk.variable} ${poppins.variable} ${nunito.variable} antialiased`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
      </head>
      <body className="font-sans">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
