import { Button } from "@/components/ui/button"
import { FileText, Settings, Shield, HelpCircle, Eye, BookOpen } from "lucide-react"
import { triggerOnboarding } from "@/lib/storage"
import type { ThemeConfig } from "./theme-settings"
import Link from "next/link"

interface HeaderProps {
  theme: ThemeConfig
  themeClasses: {
    primary: string
    accentBorder: string
    accentText: string
    accentLight: string
  }
  onShowThemeSettings: () => void
  onShowTemplateSelection: () => void
}

export function Header({ 
  theme, 
  themeClasses, 
  onShowThemeSettings, 
  onShowTemplateSelection 
}: HeaderProps) {
  return (
    <header
      className={`bg-white/90 backdrop-blur-xl border-b border-gradient-to-r border-${theme.colorScheme.split("-")[0]}-200/30 sticky top-0 z-40 shadow-lg`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main navigation */}
        <nav className="flex items-center justify-between py-4" aria-label="Main navigation">
          <div className="flex items-center space-x-4">
            {/* Enhanced logo */}
            <div className="flex items-center space-x-3">
              <div className={`relative p-3 bg-gradient-to-br ${themeClasses.primary} rounded-2xl shadow-lg group transition-transform hover:scale-105`} aria-hidden="true">
                <FileText className="h-7 w-7 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${themeClasses.primary} bg-clip-text text-transparent`}>
                  Invoice Generator
                </h1>
                <p className="text-xs text-slate-500 font-medium">Professional • Free • Instant</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced navigation buttons */}
          <div className="flex items-center space-x-3">
            {/* Blog button */}
            <Link href="/blog">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
                title="Read our blog"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Blog</span>
              </Button>
            </Link>
            
            {/* Help/Tour button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={triggerOnboarding}
              className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
              title="Show tour again"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Tour</span>
            </Button>
            
            {/* Templates button with enhanced modern styling */}
            <Button
              variant="outline"
              size="sm"
              onClick={onShowTemplateSelection}
              className="group relative bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:text-blue-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md active:scale-95"
            >
              <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">Templates</span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/5 group-hover:to-indigo-400/5 transition-all duration-300" />
            </Button>
            
            {/* Customize button with enhanced modern styling */}
            <Button
              id="customize-button"
              variant="outline"
              size="sm"
              onClick={onShowThemeSettings}
              className="group relative bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 text-violet-700 hover:from-violet-100 hover:to-purple-100 hover:border-violet-300 hover:text-violet-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md active:scale-95"
              aria-label="Customize theme and appearance"
            >
              <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
              <span className="hidden sm:inline">Customize</span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-violet-400/0 to-purple-400/0 group-hover:from-violet-400/5 group-hover:to-purple-400/5 transition-all duration-300" />
            </Button>
            
            {/* Enhanced security badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-lg text-green-700">
              <Shield className="h-4 w-4" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-none">100% Secure</span>
                <span className="text-xs leading-none opacity-75">Privacy Protected</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}