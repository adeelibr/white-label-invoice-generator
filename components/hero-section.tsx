import { Sparkles, Zap, Shield, FileText } from "lucide-react"

interface HeroSectionProps {
  themeClasses: {
    primary: string
  }
}

export function HeroSection({ themeClasses }: HeroSectionProps) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${themeClasses.primary} text-white py-16 lg:py-20`} role="main">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" aria-hidden="true"></div>
      <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" aria-hidden="true" />
            <span className="text-sm font-semibold">Free Forever • No Registration Required</span>
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Create Professional Invoices
          <span className="block text-cyan-200 text-3xl md:text-4xl lg:text-5xl mt-2">in Seconds, Not Hours</span>
        </h2>
        <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
          The most intuitive invoice generator for modern businesses. Beautiful templates, automatic calculations, and instant PDF downloads. Your data never leaves your browser.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm mb-8">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Zap className="h-4 w-4 text-yellow-300" aria-hidden="true" />
            <span>Instant PDF</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Shield className="h-4 w-4 text-green-300" aria-hidden="true" />
            <span>100% Private</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <FileText className="h-4 w-4 text-blue-300" aria-hidden="true" />
            <span>Professional Templates</span>
          </div>
        </div>
      </div>
    </section>
  )
}