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
  title: "Invoice Generator - Create Professional Invoices",
  description:
    "Free online invoice generator for small businesses and freelancers. Create professional invoices in minutes.",
  generator: "Invoice Generator",
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
      <body className="font-sans">{children}</body>
    </html>
  )
}
