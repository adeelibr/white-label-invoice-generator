"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette, Type, Settings, X } from "lucide-react"

export interface ThemeConfig {
  colorScheme: "violet-blue" | "emerald-teal" | "rose-pink" | "orange-amber" | "indigo-purple"
  fontPair: "modern" | "classic" | "elegant" | "minimal" | "creative"
}

interface ThemeSettingsProps {
  isOpen: boolean
  onClose: () => void
  theme: ThemeConfig
  onThemeChange: (theme: ThemeConfig) => void
}

const colorSchemes = {
  "violet-blue": {
    name: "Violet & Blue",
    primary: "from-violet-600 to-blue-600",
    secondary: "from-violet-50 via-blue-50 to-cyan-50",
    accent: "violet-500",
    description: "Professional and modern",
  },
  "emerald-teal": {
    name: "Emerald & Teal",
    primary: "from-emerald-600 to-teal-600",
    secondary: "from-emerald-50 via-teal-50 to-cyan-50",
    accent: "emerald-500",
    description: "Fresh and trustworthy",
  },
  "rose-pink": {
    name: "Rose & Pink",
    primary: "from-rose-600 to-pink-600",
    secondary: "from-rose-50 via-pink-50 to-fuchsia-50",
    accent: "rose-500",
    description: "Warm and creative",
  },
  "orange-amber": {
    name: "Orange & Amber",
    primary: "from-orange-600 to-amber-600",
    secondary: "from-orange-50 via-amber-50 to-yellow-50",
    accent: "orange-500",
    description: "Energetic and bold",
  },
  "indigo-purple": {
    name: "Indigo & Purple",
    primary: "from-indigo-600 to-purple-600",
    secondary: "from-indigo-50 via-purple-50 to-violet-50",
    accent: "indigo-500",
    description: "Sophisticated and elegant",
  },
}

const fontPairs = {
  modern: {
    name: "Modern",
    heading: "Inter",
    body: "Inter",
    description: "Clean and contemporary",
  },
  classic: {
    name: "Classic",
    heading: "Playfair Display",
    body: "Source Sans Pro",
    description: "Timeless and professional",
  },
  elegant: {
    name: "Elegant",
    heading: "Crimson Text",
    body: "Open Sans",
    description: "Refined and sophisticated",
  },
  minimal: {
    name: "Minimal",
    heading: "Space Grotesk",
    body: "Space Grotesk",
    description: "Simple and clean",
  },
  creative: {
    name: "Creative",
    heading: "Poppins",
    body: "Nunito",
    description: "Friendly and approachable",
  },
}

export function ThemeSettings({ isOpen, onClose, theme, onThemeChange }: ThemeSettingsProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] border-0 shadow-2xl flex flex-col overflow-hidden bg-zinc-50">
        <CardHeader className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 flex-shrink-0 bg-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Theme Customization</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <div className="flex-1 overflow-y-auto bg-white">
          <CardContent className="p-6 space-y-8">
            {/* Color Schemes */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="h-5 w-5 text-violet-600" />
                <Label className="text-lg font-semibold text-slate-800">Color Scheme</Label>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme.colorScheme === key
                        ? "border-violet-500 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => onThemeChange({ ...theme, colorScheme: key as ThemeConfig["colorScheme"] })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800">{scheme.name}</h4>
                        <p className="text-sm text-slate-600">{scheme.description}</p>
                      </div>
                      <div className="flex space-x-1">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${scheme.primary}`}></div>
                        <div className={`w-6 h-6 rounded-full bg-${scheme.accent}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Font Pairs */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Type className="h-5 w-5 text-violet-600" />
                <Label className="text-lg font-semibold text-slate-800">Font Pairing</Label>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(fontPairs).map(([key, fonts]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme.fontPair === key
                        ? "border-violet-500 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => onThemeChange({ ...theme, fontPair: key as ThemeConfig["fontPair"] })}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-800">{fonts.name}</h4>
                        <span className="text-sm text-slate-500">{fonts.description}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold" style={{ fontFamily: fonts.heading }}>
                          {fonts.heading} - Headings
                        </p>
                        <p className="text-sm" style={{ fontFamily: fonts.body }}>
                          {fonts.body} - Body text and content
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </div>

        <div className="flex justify-end space-x-3 p-6 pt-4 border-t border-slate-200 bg-white rounded-b-lg flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose} className="bg-gradient-to-r from-violet-600 to-blue-600 text-white">
            Apply Theme
          </Button>
        </div>
      </Card>
    </div>
  )
}
