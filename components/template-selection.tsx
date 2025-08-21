"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Eye } from "lucide-react"
import type { TemplateType, TemplateConfig } from "./templates"

interface TemplateSelectionProps {
  isOpen: boolean
  onClose: () => void
  currentTemplate: TemplateType
  onTemplateChange: (template: TemplateType) => void
}

const templateConfigs: Record<TemplateType, TemplateConfig> = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional professional layout with clear sections",
    preview: "Simple and timeless design with standard business formatting"
  },
  modern: {
    id: "modern", 
    name: "Modern",
    description: "Contemporary design with colored headers and clean lines",
    preview: "Sleek layout with accent colors and modern typography"
  },
  professional: {
    id: "professional",
    name: "Professional",
    description: "Corporate-style layout perfect for B2B transactions", 
    preview: "Formal business design with structured sections and emphasis"
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Fun and colorful design with playful elements",
    preview: "Vibrant layout with gradients, icons, and creative touches"
  },
  minimal: {
    id: "minimal", 
    name: "Minimal",
    description: "Ultra-clean design with lots of whitespace",
    preview: "Simple, elegant layout focusing on content clarity"
  },
  elegant: {
    id: "elegant",
    name: "Elegant", 
    description: "Sophisticated design with ornamental elements",
    preview: "Refined layout with decorative touches and premium feel"
  },
  bold: {
    id: "bold",
    name: "Bold",
    description: "High-impact design with strong visual elements", 
    preview: "Dramatic layout with bold typography and striking contrasts"
  }
}

export function TemplateSelection({ isOpen, onClose, currentTemplate, onTemplateChange }: TemplateSelectionProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] border-0 shadow-2xl flex flex-col overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Choose Invoice Template</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(templateConfigs).map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                  currentTemplate === template.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
                onClick={() => onTemplateChange(template.id)}
              >
                <div className="space-y-3">
                  {/* Template Preview Mockup */}
                  <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
                    <div className="absolute inset-2 bg-white rounded shadow-sm">
                      {/* Different visual patterns for each template */}
                      {template.id === "classic" && (
                        <div className="p-2 space-y-1">
                          <div className="h-2 bg-slate-300 rounded w-1/2"></div>
                          <div className="h-1 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-1 bg-slate-200 rounded w-2/3"></div>
                          <div className="mt-2 space-y-0.5">
                            <div className="h-1 bg-slate-100 rounded w-full"></div>
                            <div className="h-1 bg-slate-100 rounded w-4/5"></div>
                            <div className="h-1 bg-slate-100 rounded w-3/5"></div>
                          </div>
                        </div>
                      )}
                      {template.id === "modern" && (
                        <div className="p-2 space-y-1">
                          <div className="h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded w-full"></div>
                          <div className="h-1 bg-slate-200 rounded w-2/3 mt-1"></div>
                          <div className="h-1 bg-slate-200 rounded w-1/2"></div>
                          <div className="mt-2 space-y-0.5">
                            <div className="h-1 bg-blue-100 rounded w-full"></div>
                            <div className="h-1 bg-blue-100 rounded w-4/5"></div>
                          </div>
                        </div>
                      )}
                      {template.id === "professional" && (
                        <div className="p-2 space-y-1">
                          <div className="h-2 bg-slate-700 rounded w-full"></div>
                          <div className="flex gap-1 mt-1">
                            <div className="h-1 bg-slate-400 rounded w-1/3"></div>
                            <div className="h-1 bg-slate-400 rounded w-1/3"></div>
                            <div className="h-1 bg-slate-400 rounded w-1/3"></div>
                          </div>
                          <div className="mt-2 space-y-0.5">
                            <div className="h-1 bg-slate-200 rounded w-full"></div>
                            <div className="h-1 bg-slate-200 rounded w-4/5"></div>
                          </div>
                        </div>
                      )}
                      {template.id === "creative" && (
                        <div className="p-2 space-y-1">
                          <div className="h-3 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full w-full"></div>
                          <div className="flex gap-1 mt-1">
                            <div className="h-2 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full w-1/4"></div>
                            <div className="h-2 bg-gradient-to-r from-blue-300 to-green-300 rounded-full w-1/4"></div>
                          </div>
                          <div className="mt-2 space-y-0.5">
                            <div className="h-1 bg-gradient-to-r from-orange-200 to-red-200 rounded w-full"></div>
                            <div className="h-1 bg-gradient-to-r from-green-200 to-blue-200 rounded w-3/5"></div>
                          </div>
                        </div>
                      )}
                      {template.id === "minimal" && (
                        <div className="p-2 space-y-2">
                          <div className="h-1 bg-slate-300 rounded w-1/3 mx-auto"></div>
                          <div className="h-0.5 bg-slate-200 rounded w-1/2 mx-auto"></div>
                          <div className="mt-3 space-y-1">
                            <div className="h-0.5 bg-slate-100 rounded w-2/3 mx-auto"></div>
                            <div className="h-0.5 bg-slate-100 rounded w-1/2 mx-auto"></div>
                          </div>
                        </div>
                      )}
                      {template.id === "elegant" && (
                        <div className="p-2 space-y-1">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <div className="h-0.5 bg-amber-300 rounded w-2"></div>
                            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                            <div className="h-0.5 bg-amber-300 rounded w-2"></div>
                          </div>
                          <div className="h-1 bg-amber-600 rounded w-1/2 mx-auto"></div>
                          <div className="mt-2 space-y-0.5">
                            <div className="h-1 bg-amber-100 rounded w-full"></div>
                            <div className="h-1 bg-amber-100 rounded w-4/5"></div>
                          </div>
                        </div>
                      )}
                      {template.id === "bold" && (
                        <div className="p-2 space-y-1">
                          <div className="h-4 bg-black rounded w-full"></div>
                          <div className="flex gap-0.5 mt-1">
                            <div className="h-1 bg-yellow-400 rounded w-1/4"></div>
                            <div className="h-1 bg-yellow-400 rounded w-1/4"></div>
                          </div>
                          <div className="mt-1 space-y-0.5">
                            <div className="h-1 bg-slate-800 rounded w-full"></div>
                            <div className="h-1 bg-slate-800 rounded w-3/5"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Template Info */}
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                    <p className="text-xs text-slate-500 italic">{template.preview}</p>
                  </div>
                  
                  {/* Selection Indicator */}
                  {currentTemplate === template.id && (
                    <div className="flex items-center justify-center">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Currently Selected
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button onClick={onClose} size="lg" className="px-8">
              Apply Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}