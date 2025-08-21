"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, User, Mail, Phone, Globe, MapPin } from "lucide-react"
import { 
  addClient, 
  updateClient, 
  deleteClient,
  type Client 
} from "@/lib/storage"

interface ClientFormData {
  name: string
  email: string
  address: string
  phone: string
  website: string
}

interface ClientManagementDialogProps {
  isOpen: boolean
  onClose: () => void
  onClientSaved: (client: Client) => void
  onClientDeleted?: (clientId: string) => void
  editingClient?: Client | null
  mode: 'add' | 'edit'
}

export function ClientManagementDialog({
  isOpen,
  onClose,
  onClientSaved,
  onClientDeleted,
  editingClient,
  mode
}: ClientManagementDialogProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    address: "",
    phone: "",
    website: ""
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Reset form when dialog opens/closes or editing client changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && editingClient) {
        setFormData({
          name: editingClient.name,
          email: editingClient.email,
          address: editingClient.address,
          phone: editingClient.phone || "",
          website: editingClient.website || ""
        })
      } else {
        setFormData({
          name: "",
          email: "",
          address: "",
          phone: "",
          website: ""
        })
      }
      setError("")
      setShowDeleteConfirm(false)
    }
  }, [isOpen, editingClient, mode])

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Client name is required")
      return false
    }
    
    if (!formData.email.trim()) {
      setError("Email address is required")
      return false
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    
    if (!formData.address.trim()) {
      setError("Address is required")
      return false
    }
    
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      let savedClient: Client
      
      if (mode === 'edit' && editingClient) {
        const updated = updateClient(editingClient.id, formData)
        if (!updated) {
          throw new Error("Failed to update client")
        }
        savedClient = updated
      } else {
        savedClient = addClient(formData)
      }
      
      onClientSaved(savedClient)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving the client")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!editingClient || !onClientDeleted) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = deleteClient(editingClient.id)
      if (!success) {
        throw new Error("Failed to delete client")
      }
      
      onClientDeleted(editingClient.id)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting the client")
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("") // Clear error when user starts typing
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            {mode === 'add' ? 'Add New Client' : 'Edit Client'}
          </DialogTitle>
        </DialogHeader>

        {!showDeleteConfirm ? (
          <>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="clientName" className="text-sm font-medium">
                  Client Name *
                </Label>
                <Input
                  id="clientName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter client name"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="clientEmail" className="text-sm font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email Address *
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="client@example.com"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="clientAddress" className="text-sm font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Address *
                </Label>
                <Textarea
                  id="clientAddress"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Client address (line 1, line 2, city, state, zip)"
                  rows={3}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="clientPhone" className="text-sm font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Phone Number
                </Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="clientWebsite" className="text-sm font-medium flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </Label>
                <Input
                  id="clientWebsite"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://clientwebsite.com"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <div>
                {mode === 'edit' && onClientDeleted && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {mode === 'add' ? 'Add Client' : 'Save Changes'}
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-6">
              <Alert variant="destructive">
                <AlertDescription>
                  Are you sure you want to delete <strong>{editingClient?.name}</strong>?
                  <br />
                  <br />
                  This action cannot be undone. All associated invoices will remain but 
                  will no longer be linked to this client.
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Delete Client'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}