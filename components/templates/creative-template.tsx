import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Heart } from "lucide-react"
import type { InvoiceTemplateProps } from "./template-types"

export function CreativeTemplate({ data, theme }: InvoiceTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    })
  }

  const taxAmount = (data.subtotal * (Number.parseFloat(data.taxRate) || 0)) / 100
  const discountAmount = Number.parseFloat(data.discount) || 0
  const shippingAmount = Number.parseFloat(data.shippingFee) || 0

  const getColorClasses = () => {
    if (!theme) return { 
      primary: "from-purple-500 to-pink-500", 
      secondary: "from-purple-100 to-pink-100",
      accent: "text-purple-600",
      border: "border-purple-200"
    }
    
    const colorMap = {
      "violet-blue": { 
        primary: "from-violet-500 to-blue-500", 
        secondary: "from-violet-100 to-blue-100",
        accent: "text-violet-600",
        border: "border-violet-200"
      },
      "emerald-teal": { 
        primary: "from-emerald-500 to-teal-500", 
        secondary: "from-emerald-100 to-teal-100",
        accent: "text-emerald-600",
        border: "border-emerald-200"
      },
      "rose-pink": { 
        primary: "from-rose-500 to-pink-500", 
        secondary: "from-rose-100 to-pink-100",
        accent: "text-rose-600",
        border: "border-rose-200"
      },
      "orange-amber": { 
        primary: "from-orange-500 to-amber-500", 
        secondary: "from-orange-100 to-amber-100",
        accent: "text-orange-600",
        border: "border-orange-200"
      },
      "indigo-purple": { 
        primary: "from-indigo-500 to-purple-500", 
        secondary: "from-indigo-100 to-purple-100",
        accent: "text-indigo-600",
        border: "border-indigo-200"
      },
      "premium-dark": {
        primary: "from-gray-900 to-lime-900",
        secondary: "from-gray-800 to-gray-700", 
        accent: "text-lime-400",
        border: "border-lime-400"
      },
    }
    
    return colorMap[theme.colorScheme] || { 
      primary: "from-purple-500 to-pink-500", 
      secondary: "from-purple-100 to-pink-100",
      accent: "text-purple-600",
      border: "border-purple-200"
    }
  }

  const colorClasses = getColorClasses()

  return (
    <Card className={`w-full max-w-2xl overflow-hidden shadow-2xl ${colorClasses.border}`}>
      {/* Artistic Header */}
      <div className={`relative bg-gradient-to-br ${colorClasses.primary} text-white p-8 overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {data.logo ? (
              <img
                src={data.logo || "/placeholder.svg"}
                alt="Company Logo"
                className="h-12 w-auto max-w-[120px] object-contain brightness-0 invert"
                crossOrigin="anonymous"
              />
            ) : (
              <Sparkles className="h-12 w-12" />
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Invoice</h1>
              <p className="text-sm opacity-90 flex items-center">
                Made with <Heart className="h-3 w-3 mx-1" fill="currentColor" /> for you
              </p>
            </div>
          </div>
          {data.invoiceNumber && (
            <div className="text-right bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs opacity-75">Invoice #</div>
              <div className="text-2xl font-bold">{data.invoiceNumber}</div>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-8 space-y-8">
        {/* Fun Info Boxes */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`bg-gradient-to-r ${colorClasses.secondary} p-4 rounded-2xl text-center transform -rotate-1`}>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Date Created</div>
            <div className="text-sm font-bold text-gray-800 mt-1">{formatDate(data.invoiceDate)}</div>
          </div>
          <div className={`bg-gradient-to-r ${colorClasses.secondary} p-4 rounded-2xl text-center transform rotate-1`}>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Due Date</div>
            <div className="text-sm font-bold text-gray-800 mt-1">{data.dueDate ? formatDate(data.dueDate) : "ASAP 🚀"}</div>
          </div>
          <div className={`bg-gradient-to-r ${colorClasses.secondary} p-4 rounded-2xl text-center transform -rotate-1`}>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Currency</div>
            <div className="text-sm font-bold text-gray-800 mt-1">{data.currency}</div>
          </div>
        </div>

        {/* Company & Client Info with Creative Layout */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${colorClasses.secondary} rounded-full`}>
              <span className="text-sm font-bold text-gray-800">✨ From Our Team</span>
            </div>
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {data.companyDetails || "Your Amazing Company\\n🏢 123 Creative Street\\n🌆 Design City, DC 12345\\n🌍 Creative Country"}
            </div>
          </div>
          <div className="space-y-4">
            <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${colorClasses.secondary} rounded-full`}>
              <span className="text-sm font-bold text-gray-800">💖 For You</span>
            </div>
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {data.billTo || "Awesome Client\\n👤 Contact Person\\n📍 Client Street\\n🏙️ Client City, State ZIP\\n🌎 Client Country"}
            </div>
          </div>
        </div>

        {/* Creative Items List */}
        <div className="space-y-4">
          <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${colorClasses.primary} text-white rounded-full shadow-lg`}>
            <span className="text-lg font-bold">🎨 Creative Services</span>
          </div>
          
          <div className="space-y-3">
            {data.lineItems.map((item, index) => (
              <div key={item.id} className={`bg-gradient-to-r ${colorClasses.secondary} rounded-xl p-5 transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}>
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2">
                    <div className="text-lg font-bold text-gray-800">
                      {item.description || "✨ Creative Service"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-full px-3 py-1 text-sm font-bold text-gray-700">
                      {item.quantity}x
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      {data.currency === "USD" ? "$" : data.currency} {Number.parseFloat(item.unitCost || "0").toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white rounded-full px-4 py-2 font-bold text-gray-800 shadow-md">
                      {data.currency === "USD" ? "$" : data.currency} {item.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Totals Section */}
        <div className="flex justify-end">
          <div className="w-80">
            <div className={`bg-gradient-to-br ${colorClasses.primary} text-white rounded-2xl p-6 shadow-2xl transform rotate-1`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center">
                    💰 Subtotal
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                    {data.currency === "USD" ? "$" : data.currency} {data.subtotal.toFixed(2)}
                  </span>
                </div>
                {Number.parseFloat(data.taxRate) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center">
                      🏛️ Tax ({data.taxRate}%)
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                      {data.currency === "USD" ? "$" : data.currency} {taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center">
                      🎉 Discount
                    </span>
                    <span className="bg-green-500/30 backdrop-blur-sm rounded px-2 py-1">
                      -{data.currency === "USD" ? "$" : data.currency} {discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {shippingAmount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center">
                      🚚 Shipping
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                      {data.currency === "USD" ? "$" : data.currency} {shippingAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-white/30">
                  <span className="flex items-center">
                    🎯 Total
                  </span>
                  <span className="bg-white text-gray-800 rounded-lg px-4 py-2 shadow-lg">
                    {data.currency === "USD" ? "$" : data.currency} {data.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creative Footer */}
        {(data.notes || data.bankDetails) && (
          <div className="space-y-6 pt-6">
            {data.bankDetails && (
              <div>
                <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${colorClasses.secondary} rounded-full mb-4`}>
                  <span className="text-sm font-bold text-gray-800">💳 Payment Magic</span>
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 transform -rotate-1">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {data.bankDetails}
                  </p>
                </div>
              </div>
            )}
            {data.notes && (
              <div>
                <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${colorClasses.secondary} rounded-full mb-4`}>
                  <span className="text-sm font-bold text-gray-800">📝 Special Notes</span>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 transform rotate-1">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
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