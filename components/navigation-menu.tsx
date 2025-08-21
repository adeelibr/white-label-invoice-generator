"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Home, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Create invoices quickly"
  },
  {
    title: "Clients", 
    href: "/clients",
    icon: Users,
    description: "Manage your clients"
  },
  {
    title: "Invoices",
    href: "/invoices", 
    icon: FileText,
    description: "View all invoices"
  }
]

interface NavigationMenuProps {
  className?: string
}

export function NavigationMenu({ className }: NavigationMenuProps) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn("fixed top-4 left-4 z-50", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shadow-lg bg-background">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle className="text-left">Navigation</SheetTitle>
          </SheetHeader>
          <nav className="mt-8 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <div className="text-sm font-medium">White Label Invoice</div>
              <div className="text-xs text-muted-foreground">
                Professional invoicing made simple
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}