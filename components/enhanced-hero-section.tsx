"use client"

import React, { useEffect, useRef, useState } from "react"
import { Sparkles, Zap, Shield, FileText, ArrowRight, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ThemeClasses } from "@/lib/utils/themeUtils"

interface EnhancedHeroSectionProps {
  themeClasses: ThemeClasses
  onGetStarted?: () => void
  onWatchDemo?: () => void
}

// Animated background component using CSS only
function AnimatedBackground({ themeClasses }: { themeClasses: ThemeClasses }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-90",
        `from-${themeClasses.accent}/20 via-${themeClasses.accent}/10 to-transparent`
      )} />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className={cn(
          "absolute top-20 -left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl animate-pulse",
          `bg-gradient-to-r from-${themeClasses.accent}/30 to-${themeClasses.accent}/10`
        )} style={{
          animation: "float 6s ease-in-out infinite"
        }} />
        <div className={cn(
          "absolute top-40 -right-32 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl animate-pulse",
          `bg-gradient-to-l from-blue-400/20 to-${themeClasses.accent}/20`
        )} style={{
          animation: "float 8s ease-in-out infinite reverse"
        }} />
        <div className={cn(
          "absolute -bottom-20 left-40 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-pulse",
          `bg-gradient-to-t from-${themeClasses.accent}/25 to-transparent`
        )} style={{
          animation: "float 7s ease-in-out infinite"
        }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.015]" />
    </div>
  )
}

function FloatingElements({ themeClasses }: { themeClasses: ThemeClasses }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating icons */}
      <div className="absolute top-32 right-20 opacity-10">
        <Zap className={cn("w-12 h-12", `text-${themeClasses.accentText}`)} style={{
          animation: "float 4s ease-in-out infinite"
        }} />
      </div>
      <div className="absolute top-96 left-16 opacity-10">
        <Shield className={cn("w-10 h-10", `text-${themeClasses.accentText}`)} style={{
          animation: "float 5s ease-in-out infinite reverse"
        }} />
      </div>
      <div className="absolute bottom-40 right-32 opacity-10">
        <FileText className={cn("w-14 h-14", `text-${themeClasses.accentText}`)} style={{
          animation: "float 6s ease-in-out infinite"
        }} />
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-64 left-32">
        <div className={cn(
          "w-3 h-3 rounded-full opacity-20",
          `bg-${themeClasses.accent}`
        )} style={{
          animation: "float 3s ease-in-out infinite"
        }} />
      </div>
      <div className="absolute top-80 right-64">
        <div className={cn(
          "w-2 h-2 rounded-full opacity-25",
          `bg-${themeClasses.accent}`
        )} style={{
          animation: "float 4s ease-in-out infinite reverse"
        }} />
      </div>
    </div>
  )
}

function HeroBadge() {
  return (
    <div className={cn(
      "inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white/15 hover:scale-105",
      "group"
    )}>
      <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse group-hover:animate-spin" />
      <span className="text-sm font-semibold text-white">
        Free Forever • No Registration Required • 100% Private
      </span>
    </div>
  )
}

function FeaturePills() {
  const features = [
    { icon: Zap, label: "Instant PDF", color: "text-yellow-300" },
    { icon: Shield, label: "100% Private", color: "text-green-300" },
    { icon: FileText, label: "Professional Templates", color: "text-blue-300" },
  ]

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm">
      {features.map((feature, index) => (
        <div
          key={feature.label}
          className={cn(
            "flex items-center space-x-2 px-4 py-3 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105 group border border-white/10",
            "animate-fade-in-up"
          )}
          style={{
            animationDelay: `${index * 0.1 + 0.5}s`,
            animationFillMode: "both"
          }}
        >
          <feature.icon className={cn("h-5 w-5 group-hover:scale-110 transition-transform duration-300", feature.color)} />
          <span className="font-medium text-white/90">{feature.label}</span>
        </div>
      ))}
    </div>
  )
}

function HeroContent({ themeClasses, onGetStarted, onWatchDemo }: EnhancedHeroSectionProps) {
  return (
    <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Badge */}
      <div className="flex justify-center mb-8 animate-fade-in">
        <HeroBadge />
      </div>

      {/* Main heading */}
      <h1 className={cn(
        "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white",
        "animate-fade-in-up"
      )} style={{
        animationDelay: "0.2s",
        animationFillMode: "both"
      }}>
        Create Professional{" "}
        <span className={cn(
          "block bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent",
          "animate-shimmer bg-300% bg-gradient-to-r"
        )}>
          Invoices in Seconds
        </span>
      </h1>

      {/* Subtitle */}
      <p className={cn(
        "text-lg md:text-xl lg:text-2xl mb-10 text-blue-100/90 max-w-4xl mx-auto leading-relaxed",
        "animate-fade-in-up"
      )} style={{
        animationDelay: "0.4s",
        animationFillMode: "both"
      }}>
        The most intuitive invoice generator for modern businesses. Beautiful templates, 
        automatic calculations, and instant PDF downloads.{" "}
        <span className="text-cyan-200 font-semibold">Your data never leaves your browser.</span>
      </p>

      {/* Feature pills */}
      <div className="mb-10">
        <FeaturePills />
      </div>

      {/* CTA buttons */}
      <div className={cn(
        "flex flex-col sm:flex-row items-center justify-center gap-4 mb-6",
        "animate-fade-in-up"
      )} style={{
        animationDelay: "0.6s",
        animationFillMode: "both"
      }}>
        <button
          onClick={onGetStarted}
          className={cn(
            "group relative px-8 py-4 text-lg font-semibold text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl",
            `bg-gradient-to-r ${themeClasses.primary} hover:${themeClasses.primaryHover}`,
            "shadow-lg hover:shadow-2xl border border-white/20",
            "min-w-[200px] overflow-hidden"
          )}
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>

        <button
          onClick={onWatchDemo}
          className={cn(
            "group px-8 py-4 text-lg font-medium text-white rounded-full transition-all duration-300 transform hover:scale-105",
            "bg-black/30 hover:bg-black/40 border border-white/30 hover:border-white/50 backdrop-blur-sm",
            "min-w-[200px]"
          )}
        >
          <span className="flex items-center justify-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
              <Play className="relative w-5 h-5 fill-current" />
            </div>
            <span>Watch Demo</span>
          </span>
        </button>
      </div>

      {/* Trust indicator */}
      <p className={cn(
        "text-sm text-blue-100/70 animate-fade-in-up"
      )} style={{
        animationDelay: "0.8s",
        animationFillMode: "both"
      }}>
        ✨ Trusted by thousands of businesses worldwide
      </p>
    </div>
  )
}

export function EnhancedHeroSection({ themeClasses, onGetStarted, onWatchDemo }: EnhancedHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse tracking for subtle parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('mousemove', handleMouseMove)
      return () => section.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleGetStarted = () => {
    // Scroll to the main form
    const formElement = document.querySelector('[data-section="invoice-form"]')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
    onGetStarted?.()
  }

  const handleWatchDemo = () => {
    // Could trigger a demo modal or tour
    onWatchDemo?.()
  }

  return (
    <>
      {/* Add required CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .bg-300\\% {
          background-size: 300% 300%;
        }
        
        .bg-grid-white\\/\\[0\\.02\\] {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
        
        .bg-grid-16 {
          background-size: 16px 16px;
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>

      <section
        ref={sectionRef}
        className={cn(
          "relative min-h-screen flex items-center justify-center overflow-hidden",
          `bg-gradient-to-br ${themeClasses.primary}`,
          "text-white"
        )}
        role="main"
        aria-labelledby="hero-title"
      >
        {/* Animated background */}
        <AnimatedBackground themeClasses={themeClasses} />
        
        {/* Floating elements */}
        <FloatingElements themeClasses={themeClasses} />

        {/* Hero content */}
        <div 
          className="relative z-10 py-20 lg:py-32"
          style={{
            transform: `translate(${mousePosition.x * 10 - 5}px, ${mousePosition.y * 10 - 5}px)`
          }}
        >
          <HeroContent 
            themeClasses={themeClasses} 
            onGetStarted={handleGetStarted}
            onWatchDemo={handleWatchDemo}
          />
        </div>

        {/* Bottom fade to blend with next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
      </section>
    </>
  )
}