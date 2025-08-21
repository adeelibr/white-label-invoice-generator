"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Palette, 
  Type, 
  Settings, 
  X, 
  Moon, 
  Sun, 
  Monitor,
  Zap,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react"
import { useModernTheme } from "@/components/theme-provider"
import { modernColorSchemes, enhancedFontPairs } from "@/lib/theme-utils"
import type { ModernThemeConfig } from "@/lib/theme-utils"

interface EnhancedThemeSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function EnhancedThemeSettings({ isOpen, onClose }: EnhancedThemeSettingsProps) {
  const { theme, setTheme, toggleMode, toggleAnimations, toggleGlassmorphism } = useModernTheme()

  if (!isOpen) return null

  const getModeIcon = (mode: ModernThemeConfig['mode']) => {
    switch (mode) {
      case 'light': return <Sun className="h-4 w-4" />
      case 'dark': return <Moon className="h-4 w-4" />
      case 'system': return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[90vh] border-0 shadow-modern-2xl flex flex-col overflow-hidden glass-medium animate-scale-in">
        <CardHeader className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gradient flex items-center space-x-3">
              <Settings className="h-6 w-6" />
              <span>Advanced Theme Studio</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover-lift"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Customize your invoice generator with modern themes, typography, and visual effects
          </p>
        </CardHeader>

        <div className="flex-1 overflow-y-auto">
          <CardContent className="p-8 space-y-10">
            
            {/* Color Schemes */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <Label className="text-xl font-semibold">Color Schemes</Label>
                  <p className="text-sm text-muted-foreground">Choose from modern gradient-based color palettes</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(modernColorSchemes).map(([key, scheme]) => (
                  <div
                    key={key}
                    className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover-lift ${
                      theme.colorScheme === key
                        ? "border-primary shadow-modern-lg scale-105"
                        : "border-border hover:border-primary/50 glass-light"
                    }`}
                    onClick={() => setTheme({ ...theme, colorScheme: key as ModernThemeConfig["colorScheme"] })}
                  >
                    <div className="space-y-4">
                      {/* Color Preview */}
                      <div className="flex space-x-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${scheme.primary} shadow-md`} />
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${scheme.secondary} shadow-md`} />
                        <div className={`w-6 h-6 rounded-full bg-${scheme.accent} shadow-md`} />
                      </div>
                      
                      {/* Scheme Info */}
                      <div>
                        <h4 className="font-semibold text-lg capitalize">
                          {key.replace('-', ' & ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Modern gradient palette with glassmorphism support
                        </p>
                      </div>
                      
                      {/* Selection indicator */}
                      {theme.colorScheme === key && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
                          <Eye className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg">
                  <Type className="h-5 w-5" />
                </div>
                <div>
                  <Label className="text-xl font-semibold">Typography</Label>
                  <p className="text-sm text-muted-foreground">Professional font pairings for modern invoices</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(enhancedFontPairs).map(([key, fonts]) => (
                  <div
                    key={key}
                    className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover-lift ${
                      theme.fontPair === key
                        ? "border-primary shadow-modern-lg"
                        : "border-border hover:border-primary/50 glass-light"
                    }`}
                    onClick={() => setTheme({ ...theme, fontPair: key as ModernThemeConfig["fontPair"] })}
                  >
                    <div className="space-y-3">
                      <h4 className={`text-lg font-bold capitalize ${fonts.heading}`}>
                        {key} Style
                      </h4>
                      <p className={`text-sm ${fonts.body}`}>
                        The quick brown fox jumps over the lazy dog. Perfect for professional invoice generation with excellent readability.
                      </p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Headings</span>
                        <span>Body Text</span>
                      </div>
                    </div>
                    
                    {theme.fontPair === key && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
                        <Eye className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Display Mode & Effects */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <Label className="text-xl font-semibold">Visual Effects</Label>
                  <p className="text-sm text-muted-foreground">Control animations, glassmorphism, and display modes</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Theme Mode */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Theme Mode</Label>
                  <div className="space-y-2">
                    {(['light', 'dark', 'system'] as const).map((mode) => (
                      <Button
                        key={mode}
                        variant={theme.mode === mode ? "default" : "outline"}
                        onClick={() => setTheme({ ...theme, mode })}
                        className="w-full justify-start space-x-2 hover-lift"
                      >
                        {getModeIcon(mode)}
                        <span className="capitalize">{mode}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Animations */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Animations</Label>
                  <Button
                    variant={theme.animations ? "default" : "outline"}
                    onClick={toggleAnimations}
                    className="w-full justify-start space-x-2 hover-lift"
                  >
                    <Zap className="h-4 w-4" />
                    <span>{theme.animations ? 'Enabled' : 'Disabled'}</span>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Smooth micro-interactions and transitions
                  </p>
                </div>
                
                {/* Glassmorphism */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Glass Effects</Label>
                  <Button
                    variant={theme.glassmorphism ? "default" : "outline"}
                    onClick={toggleGlassmorphism}
                    className="w-full justify-start space-x-2 hover-lift"
                  >
                    {theme.glassmorphism ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <span>{theme.glassmorphism ? 'Enabled' : 'Disabled'}</span>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Modern glassmorphism and backdrop blur effects
                  </p>
                </div>
                
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t pt-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  onClick={toggleMode}
                  variant="outline" 
                  className="hover-lift"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Toggle Mode
                </Button>
                <Button 
                  onClick={toggleAnimations}
                  variant="outline"
                  className="hover-lift"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Toggle Animations
                </Button>
                <Button 
                  onClick={toggleGlassmorphism}
                  variant="outline"
                  className="hover-lift"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Toggle Glass Effects
                </Button>
              </div>
            </div>
            
          </CardContent>
        </div>
      </Card>
    </div>
  )
}