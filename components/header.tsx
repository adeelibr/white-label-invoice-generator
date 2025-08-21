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
            
            {/* Templates button with enhanced styling */}
            <Button
              variant="outline"
              size="sm"
              onClick={onShowTemplateSelection}
              className={`border-${themeClasses.accentBorder} text-${themeClasses.accentText} hover:bg-${themeClasses.accentLight} transition-colors duration-200 font-medium`}
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Templates</span>
            </Button>
            
            {/* Customize button with enhanced styling */}
            <Button
              id="customize-button"
              variant="outline"
              size="sm"
              onClick={onShowThemeSettings}
              className={`border-${themeClasses.accentBorder} text-${themeClasses.accentText} hover:bg-${themeClasses.accentLight} transition-colors duration-200 font-medium`}
              aria-label="Customize theme and appearance"
            >
              <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Customize</span>
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