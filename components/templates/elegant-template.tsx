import { Card, CardContent } from "@/components/ui/card"
import { Crown } from "lucide-react"
import type { InvoiceTemplateProps } from "./template-types"

export function ElegantTemplate({ data, theme }: InvoiceTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    })
  }

  const taxAmount = (data.subtotal * (Number.parseFloat(data.taxRate) || 0)) / 100
  const discountAmount = Number.parseFloat(data.discount) || 0
  const shippingAmount = Number.parseFloat(data.shippingFee) || 0

  const getColorClasses = () => {
    if (!theme) return { accent: "text-amber-700", light: "bg-amber-50", border: "border-amber-200" }
    
    const colorMap = {
      "violet-blue": { accent: "text-violet-700", light: "bg-violet-50", border: "border-violet-200" },
      "emerald-teal": { accent: "text-emerald-700", light: "bg-emerald-50", border: "border-emerald-200" },
      "rose-pink": { accent: "text-rose-700", light: "bg-rose-50", border: "border-rose-200" },
      "orange-amber": { accent: "text-amber-700", light: "bg-amber-50", border: "border-amber-200" },
      "indigo-purple": { accent: "text-purple-700", light: "bg-purple-50", border: "border-purple-200" },
      "premium-dark": { accent: "text-lime-400", light: "bg-gray-800", border: "border-lime-400" },
    }
    
    return colorMap[theme.colorScheme] || { accent: "text-amber-700", light: "bg-amber-50", border: "border-amber-200" }
  }

  const colorClasses = getColorClasses()

  return (
    <Card className="w-full max-w-2xl shadow-xl bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-12 space-y-10">
        {/* Elegant Header with Ornamental Design */}
        <div className="text-center space-y-6 pb-8">
          {data.logo && (
            <div className="flex justify-center">
              <img
                src={data.logo || "/placeholder.svg"}
                alt="Company Logo"
                className="h-16 w-auto max-w-[150px] object-contain"
                crossOrigin="anonymous"
              />
            </div>
          )}
          
          <div className="relative">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className={`h-px w-24 ${colorClasses.accent.replace('text-', 'bg-')}`}></div>
              <Crown className={`h-8 w-8 ${colorClasses.accent}`} />
              <div className={`h-px w-24 ${colorClasses.accent.replace('text-', 'bg-')}`}></div>
            </div>
            <h1 className={`text-4xl font-serif ${colorClasses.accent} mb-2 tracking-wider`}>INVOICE</h1>
            <p className="text-gray-500 text-sm italic">Sophisticated Business Document</p>
          </div>
          
          {data.invoiceNumber && (
            <div className={`inline-block ${colorClasses.light} ${colorClasses.border} border-2 rounded-lg px-6 py-3`}>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Document Number</div>
              <div className={`text-xl font-serif ${colorClasses.accent} font-bold`}>{data.invoiceNumber}</div>
            </div>
          )}
        </div>

        {/* Elegant Date Section */}
        <div className={`grid grid-cols-3 gap-6 p-6 ${colorClasses.light} rounded-lg border-l-4 ${colorClasses.border}`}>
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Issued</div>
            <div className="font-serif text-gray-800 text-sm">{formatDate(data.invoiceDate)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Due Date</div>
            <div className="font-serif text-gray-800 text-sm">{data.dueDate ? formatDate(data.dueDate) : "Upon Receipt"}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Currency</div>
            <div className="font-serif text-gray-800 text-sm">{data.currency}</div>
          </div>
        </div>

        {/* Sophisticated Address Section */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full`}></div>
              <h3 className={`font-serif text-lg ${colorClasses.accent} font-semibold`}>From</h3>
            </div>
            <div className="ml-5 pl-4 border-l-2 border-gray-200">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-light">
                {data.companyDetails || "Distinguished Company Name\\nElegant Business Address\\nPremium City, State ZIP\\nEstablished Country"}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full`}></div>
              <h3 className={`font-serif text-lg ${colorClasses.accent} font-semibold`}>To</h3>
            </div>
            <div className="ml-5 pl-4 border-l-2 border-gray-200">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-light">
                {data.billTo || "Valued Client Name\\nRespected Contact Person\\nDistinguished Address\\nPremium City, State ZIP\\nEstablished Country"}
              </div>
            </div>
          </div>
        </div>

        {/* Refined Services Table */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 ${colorClasses.accent.replace('text-', 'bg-')} transform rotate-45`}></div>
            <h3 className={`font-serif text-xl ${colorClasses.accent} font-semibold`}>Premium Services</h3>
            <div className={`flex-1 h-px ${colorClasses.accent.replace('text-', 'bg-')} opacity-30`}></div>
          </div>
          
          <div className="space-y-1">
            {/* Table Header */}
            <div className={`grid grid-cols-6 gap-6 p-4 ${colorClasses.light} rounded-t-lg border-b-2 ${colorClasses.border}`}>
              <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-widest">Description</div>
              <div className="text-center text-xs font-semibold text-gray-600 uppercase tracking-widest">Quantity</div>
              <div className="text-center text-xs font-semibold text-gray-600 uppercase tracking-widest">Rate</div>
              <div className="text-center text-xs font-semibold text-gray-600 uppercase tracking-widest">Amount</div>
            </div>
            
            {/* Table Body */}
            {data.lineItems.map((item, index) => (
              <div key={item.id} className={`grid grid-cols-6 gap-6 p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}>
                <div className="col-span-3 text-sm text-gray-800 font-medium">
                  {item.description || "Premium Service"}
                </div>
                <div className="text-center text-sm text-gray-600">{item.quantity}</div>
                <div className="text-center text-sm text-gray-600">
                  {data.currency === "USD" ? "$" : data.currency} {Number.parseFloat(item.unitCost || "0").toFixed(2)}
                </div>
                <div className="text-center text-sm font-semibold text-gray-800">
                  {data.currency === "USD" ? "$" : data.currency} {item.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elegant Totals */}
        <div className="flex justify-end pt-8">
          <div className="w-80 space-y-4">
            <div className={`p-6 ${colorClasses.light} rounded-lg border-2 ${colorClasses.border}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-light text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">{data.currency === "USD" ? "$" : data.currency} {data.subtotal.toFixed(2)}</span>
                </div>
                {Number.parseFloat(data.taxRate) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-light text-gray-600">Tax ({data.taxRate}%)</span>
                    <span className="font-medium text-gray-800">{data.currency === "USD" ? "$" : data.currency} {taxAmount.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-light text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-{data.currency === "USD" ? "$" : data.currency} {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {shippingAmount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-light text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-800">{data.currency === "USD" ? "$" : data.currency} {shippingAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className={`font-serif text-lg ${colorClasses.accent} font-semibold`}>Total Amount</span>
                    <span className={`font-serif text-2xl ${colorClasses.accent} font-bold`}>
                      {data.currency === "USD" ? "$" : data.currency} {data.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refined Notes Section */}
        {(data.notes || data.bankDetails) && (
          <div className="space-y-8 pt-8 border-t border-gray-200">
            {data.bankDetails && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-2 h-2 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full`}></div>
                  <h4 className={`font-serif text-lg ${colorClasses.accent} font-semibold`}>Payment Instructions</h4>
                </div>
                <div className="ml-5 pl-6 border-l-2 border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-light">
                    {data.bankDetails}
                  </p>
                </div>
              </div>
            )}
            {data.notes && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-2 h-2 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full`}></div>
                  <h4 className={`font-serif text-lg ${colorClasses.accent} font-semibold`}>Additional Notes</h4>
                </div>
                <div className="ml-5 pl-6 border-l-2 border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-light italic">
                    {data.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Decoration */}
        <div className="flex justify-center pt-8">
          <div className="flex items-center space-x-4">
            <div className={`h-px w-16 ${colorClasses.accent.replace('text-', 'bg-')} opacity-50`}></div>
            <div className={`w-1 h-1 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full opacity-50`}></div>
            <div className={`h-px w-16 ${colorClasses.accent.replace('text-', 'bg-')} opacity-50`}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}