import { Card, CardContent } from "@/components/ui/card"
import { Zap, Target } from "lucide-react"
import type { InvoiceTemplateProps } from "./template-types"

export function BoldTemplate({ data, theme }: InvoiceTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "2-digit",
    }).toUpperCase()
  }

  const taxAmount = (data.subtotal * (Number.parseFloat(data.taxRate) || 0)) / 100
  const discountAmount = Number.parseFloat(data.discount) || 0
  const shippingAmount = Number.parseFloat(data.shippingFee) || 0

  const getColorClasses = () => {
    if (!theme) return { 
      primary: "bg-black text-white", 
      secondary: "bg-gray-900 text-white",
      accent: "bg-yellow-400 text-black",
      light: "bg-gray-100"
    }
    
    const colorMap = {
      "violet-blue": { 
        primary: "bg-violet-600 text-white", 
        secondary: "bg-violet-700 text-white",
        accent: "bg-cyan-400 text-black",
        light: "bg-violet-50"
      },
      "emerald-teal": { 
        primary: "bg-emerald-600 text-white", 
        secondary: "bg-emerald-700 text-white",
        accent: "bg-yellow-400 text-black",
        light: "bg-emerald-50"
      },
      "rose-pink": { 
        primary: "bg-rose-600 text-white", 
        secondary: "bg-rose-700 text-white",
        accent: "bg-orange-400 text-black",
        light: "bg-rose-50"
      },
      "orange-amber": { 
        primary: "bg-orange-600 text-white", 
        secondary: "bg-orange-700 text-white",
        accent: "bg-yellow-300 text-black",
        light: "bg-orange-50"
      },
      "indigo-purple": { 
        primary: "bg-indigo-600 text-white", 
        secondary: "bg-indigo-700 text-white",
        accent: "bg-pink-400 text-black",
        light: "bg-indigo-50"
      },
      "premium-dark": {
        primary: "bg-gray-900 text-lime-400",
        secondary: "bg-gray-800 text-lime-400", 
        accent: "bg-lime-400 text-black",
        light: "bg-gray-800"
      },
    }
    
    return colorMap[theme.colorScheme] || { 
      primary: "bg-black text-white", 
      secondary: "bg-gray-900 text-white",
      accent: "bg-yellow-400 text-black",
      light: "bg-gray-100"
    }
  }

  const colorClasses = getColorClasses()

  return (
    <Card className="w-full max-w-2xl overflow-hidden shadow-2xl border-4 border-black">
      {/* Bold Dramatic Header */}
      <div className={`${colorClasses.primary} p-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 transform rotate-45 translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 transform rotate-45 -translate-x-12 translate-y-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {data.logo ? (
                <div className="bg-white p-2 rounded-lg">
                  <img
                    src={data.logo || "/placeholder.svg"}
                    alt="Company Logo"
                    className="h-12 w-auto max-w-[120px] object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <Zap className="h-16 w-16" />
              )}
              <div>
                <h1 className="text-5xl font-black tracking-tighter mb-1">INVOICE</h1>
                <p className="text-lg font-bold opacity-90 tracking-wide">BUSINESS POWER DOCUMENT</p>
              </div>
            </div>
            
            {data.invoiceNumber && (
              <div className={`${colorClasses.accent} p-4 rounded-lg transform rotate-3 shadow-lg`}>
                <div className="text-xs font-black tracking-widest mb-1">INVOICE #</div>
                <div className="text-3xl font-black tracking-wider">{data.invoiceNumber}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-8 space-y-8">
        {/* Bold Date Strip */}
        <div className={`${colorClasses.secondary} p-4 rounded-lg -mx-8 mx-0`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs font-black tracking-widest mb-2 opacity-80">CREATED</div>
              <div className="text-lg font-black tracking-wide">{formatDate(data.invoiceDate)}</div>
            </div>
            <div>
              <div className="text-xs font-black tracking-widest mb-2 opacity-80">DUE DATE</div>
              <div className="text-lg font-black tracking-wide">{data.dueDate ? formatDate(data.dueDate) : "IMMEDIATE"}</div>
            </div>
            <div>
              <div className="text-xs font-black tracking-widest mb-2 opacity-80">CURRENCY</div>
              <div className="text-lg font-black tracking-wide">{data.currency}</div>
            </div>
          </div>
        </div>

        {/* Bold Company Information */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className={`${colorClasses.accent} inline-block px-4 py-2 rounded-lg mb-4 transform -rotate-1`}>
              <h3 className="text-lg font-black tracking-wide">FROM</h3>
            </div>
            <div className="bg-black text-white p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-line">
              {data.companyDetails || "POWER COMPANY\\nHEADQUARTERS BUILDING\\nDOMINATE CITY, STATE 12345\\nCONQUER COUNTRY"}
            </div>
          </div>
          
          <div>
            <div className={`${colorClasses.accent} inline-block px-4 py-2 rounded-lg mb-4 transform rotate-1`}>
              <h3 className="text-lg font-black tracking-wide">TO</h3>
            </div>
            <div className="bg-black text-white p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-line">
              {data.billTo || "CLIENT COMPANY\\nCONTACT PERSON\\nCLIENT STREET ADDRESS\\nCLIENT CITY, STATE 12345\\nCLIENT COUNTRY"}
            </div>
          </div>
        </div>

        {/* Bold Services Section */}
        <div>
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 mr-3" />
            <h3 className="text-2xl font-black tracking-wide uppercase">POWER SERVICES</h3>
            <div className="flex-1 h-2 bg-black ml-4 rounded-full"></div>
          </div>
          
          <div className="space-y-2">
            {/* Bold Table Header */}
            <div className={`${colorClasses.secondary} p-4 rounded-lg`}>
              <div className="grid grid-cols-6 gap-4 font-black text-xs tracking-widest uppercase">
                <div className="col-span-3">SERVICE DESCRIPTION</div>
                <div className="text-center">QTY</div>
                <div className="text-center">RATE</div>
                <div className="text-center">TOTAL</div>
              </div>
            </div>
            
            {/* Bold Items */}
            {data.lineItems.map((item, index) => (
              <div key={item.id} className={`border-4 border-black p-4 rounded-lg ${index % 2 === 0 ? 'bg-white' : colorClasses.light} transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}>
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-3">
                    <div className="font-black text-lg tracking-wide uppercase">
                      {item.description || "POWER SERVICE"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-black text-white rounded-full px-3 py-1 font-black text-lg">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="text-center font-bold text-lg">
                    {data.currency === "USD" ? "$" : data.currency}{Number.parseFloat(item.unitCost || "0").toFixed(2)}
                  </div>
                  <div className="text-center">
                    <div className={`${colorClasses.accent} rounded-full px-4 py-2 font-black text-xl tracking-wide`}>
                      {data.currency === "USD" ? "$" : data.currency}{item.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bold Totals */}
        <div className="flex justify-end">
          <div className="w-80">
            <div className="bg-black text-white p-6 rounded-lg border-4 border-black">
              <div className="space-y-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="tracking-wide">SUBTOTAL</span>
                  <span className="font-black">{data.currency === "USD" ? "$" : data.currency} {data.subtotal.toFixed(2)}</span>
                </div>
                {Number.parseFloat(data.taxRate) > 0 && (
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span className="tracking-wide">TAX ({data.taxRate}%)</span>
                    <span className="font-black">{data.currency === "USD" ? "$" : data.currency} {taxAmount.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span className="tracking-wide">DISCOUNT</span>
                    <span className="font-black text-green-400">-{data.currency === "USD" ? "$" : data.currency} {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {shippingAmount > 0 && (
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span className="tracking-wide">SHIPPING</span>
                    <span className="font-black">{data.currency === "USD" ? "$" : data.currency} {shippingAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-4 border-white pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black tracking-wide">TOTAL</span>
                    <span className={`${colorClasses.accent} text-3xl font-black px-4 py-2 rounded-lg`}>
                      {data.currency === "USD" ? "$" : data.currency} {data.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bold Footer */}
        {(data.notes || data.bankDetails) && (
          <div className="space-y-6">
            {data.bankDetails && (
              <div>
                <div className={`${colorClasses.accent} inline-block px-6 py-3 rounded-lg mb-4 transform -rotate-1`}>
                  <h4 className="font-black text-lg tracking-wide">PAYMENT POWER</h4>
                </div>
                <div className="bg-red-50 border-4 border-red-200 p-4 rounded-lg transform rotate-1">
                  <p className="font-bold text-red-800 leading-relaxed whitespace-pre-line">
                    {data.bankDetails}
                  </p>
                </div>
              </div>
            )}
            {data.notes && (
              <div>
                <div className={`${colorClasses.accent} inline-block px-6 py-3 rounded-lg mb-4 transform rotate-1`}>
                  <h4 className="font-black text-lg tracking-wide">POWER NOTES</h4>
                </div>
                <div className="bg-blue-50 border-4 border-blue-200 p-4 rounded-lg transform -rotate-1">
                  <p className="font-bold text-blue-800 leading-relaxed whitespace-pre-line">
                    {data.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}