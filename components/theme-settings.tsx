"use client"
import { Label } from "@/components/ui/label"
import { Palette, Type, Settings } from "lucide-react"
import { SharedModal } from "@/components/ui/shared-modal"

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
  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Theme Customization"
      subtitle="Personalize your invoice design with beautiful color schemes and typography"
      icon={<Settings className="h-6 w-6" />}
    >
      <div className="space-y-8">
        {/* Color Schemes */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-sm">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <Label className="text-xl font-bold text-slate-800">Color Schemes</Label>
              <p className="text-sm text-slate-600">Choose the perfect color palette for your invoices</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(colorSchemes).map(([key, scheme]) => (
              <div
                key={key}
                className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  theme.colorScheme === key
                    ? "border-violet-500 bg-gradient-to-r from-violet-50 via-blue-50 to-cyan-50 shadow-lg"
                    : "border-slate-200 hover:border-violet-300 bg-white hover:bg-gradient-to-r hover:from-violet-50/30 hover:via-blue-50/30 hover:to-cyan-50/30 hover:shadow-md"
                }`}
                onClick={() => onThemeChange({ ...theme, colorScheme: key as ThemeConfig["colorScheme"] })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="text-lg font-bold text-slate-800">{scheme.name}</h4>
                      {theme.colorScheme === key && (
                        <span className="px-3 py-1 bg-violet-500 text-white text-xs font-semibold rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{scheme.description}</p>
                    
                    {/* Color Preview */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-slate-500">Preview:</span>
                      <div className="flex space-x-1">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${scheme.primary} shadow-sm ring-2 ring-white`}></div>
                        <div className={`w-6 h-6 rounded-md bg-${scheme.accent} shadow-sm ring-1 ring-white mt-1`}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Large Color Circles */}
                  <div className="flex flex-col space-y-2">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${scheme.primary} shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform duration-300`}></div>
                    <div className={`w-8 h-8 rounded-xl bg-${scheme.accent} shadow-md ring-2 ring-white group-hover:scale-110 transition-transform duration-300`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Font Pairs */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm">
              <Type className="h-5 w-5" />
            </div>
            <div>
              <Label className="text-xl font-bold text-slate-800">Typography</Label>
              <p className="text-sm text-slate-600">Select the perfect font combination for readability</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(fontPairs).map(([key, fonts]) => (
              <div
                key={key}
                className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                  theme.fontPair === key
                    ? "border-blue-500 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 shadow-lg"
                    : "border-slate-200 hover:border-blue-300 bg-white hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-indigo-50/30 hover:to-violet-50/30 hover:shadow-md"
                }`}
                onClick={() => onThemeChange({ ...theme, fontPair: key as ThemeConfig["fontPair"] })}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-bold text-slate-800">{fonts.name}</h4>
                      {theme.fontPair === key && (
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{fonts.description}</span>
                  </div>
                  
                  {/* Font Preview */}
                  <div className="space-y-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Heading Font</span>
                      <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: fonts.heading }}>
                        {fonts.heading}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Body Font</span>
                      <p className="text-base text-slate-700" style={{ fontFamily: fonts.body }}>
                        {fonts.body} - Perfect for readable body text and invoice content
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SharedModal>
  )
}
