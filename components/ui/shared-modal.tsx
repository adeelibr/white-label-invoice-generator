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
  maxWidth?: string
  headerGradient?: string
}

export function SharedModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = "max-w-4xl",
  headerGradient = "from-violet-500/10 via-blue-500/10 to-cyan-500/10"
}: SharedModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className={`w-full ${maxWidth} max-h-[90vh] border-0 shadow-2xl flex flex-col overflow-hidden bg-white/95 backdrop-blur-sm`}>
        <CardHeader className={`bg-gradient-to-r ${headerGradient} flex-shrink-0 border-b border-violet-100/50`}>
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
      </Card>
    </div>
  )
}