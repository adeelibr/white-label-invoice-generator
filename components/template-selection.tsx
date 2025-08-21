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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] border-0 shadow-2xl flex flex-col overflow-hidden bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 flex-shrink-0 border-b border-blue-100/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
                <Eye className="h-6 w-6" />
              </div>
              <span>Choose Invoice Template</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-blue-100 transition-colors duration-200 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-slate-600 mt-2 text-sm">Select a professional template that matches your business style</p>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-50/30 to-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(templateConfigs).map((template) => (
              <div
                key={template.id}
                className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  currentTemplate === template.id
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-lg ring-2 ring-blue-200"
                    : "border-slate-200 hover:border-blue-300 bg-white hover:bg-gradient-to-br hover:from-blue-50/30 hover:via-indigo-50/30 hover:to-purple-50/30"
                }`}
                onClick={() => onTemplateChange(template.id)}
              >
                <div className="space-y-4">
                  {/* Template Preview Mockup */}
                  <div className="relative h-40 bg-gradient-to-br from-slate-100 via-slate-50 to-white rounded-xl overflow-hidden border-2 border-slate-200/50 group-hover:border-blue-200">
                    <div className="absolute inset-3 bg-white rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl">
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
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center space-x-2">
                          <span>{template.name}</span>
                          {currentTemplate === template.id && (
                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              <span>Active</span>
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">{template.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>Professional</span>
                          </div>
                          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                          <span className="italic">{template.preview}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className={`text-center text-sm font-medium transition-all duration-200 ${
                        currentTemplate === template.id 
                          ? "text-blue-600" 
                          : "text-slate-500 group-hover:text-blue-600"
                      }`}>
                        {currentTemplate === template.id ? "✓ Currently Selected" : "Click to Select"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Ready to apply your template?</h4>
                <p className="text-sm text-slate-600">Your invoice will update instantly with the new design</p>
              </div>
              <Button 
                onClick={onClose} 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
              >
                <span>Apply Template</span>
                <div className="ml-2 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}