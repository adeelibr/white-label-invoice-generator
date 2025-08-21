"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ReactNode } from "react"

interface SharedModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon: ReactNode
  children: ReactNode
  applyButtonText?: string
  onApply?: () => void
  maxWidth?: string
  headerGradient?: string
  footerMessage?: string
}

export function SharedModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  applyButtonText = "Apply",
  onApply,
  maxWidth = "max-w-4xl",
  headerGradient = "from-violet-500/10 via-blue-500/10 to-cyan-500/10",
  footerMessage
}: SharedModalProps) {
  if (!isOpen) return null

  const handleApply = () => {
    if (onApply) {
      onApply()
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className={`w-full ${maxWidth} max-h-[90vh] border-0 shadow-2xl flex flex-col overflow-hidden bg-white/95 backdrop-blur-sm`}>
        <CardHeader className={`bg-gradient-to-r ${headerGradient} flex-shrink-0 border-b border-violet-100/50 py-4`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg">
                {icon}
              </div>
              <span>{title}</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-violet-100 transition-colors duration-200 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {subtitle && (
            <p className="text-slate-600 mt-2 text-sm">{subtitle}</p>
          )}
        </CardHeader>

        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-white">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </div>

        <div className="flex justify-between items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex-shrink-0">
          <div className="text-sm text-slate-600">
            {footerMessage && <span className="font-medium">{footerMessage}</span>}
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApply} 
              className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 text-white hover:from-violet-700 hover:via-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6"
            >
              <span>{applyButtonText}</span>
              <div className="ml-2 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}