import { Card, CardContent } from "@/components/ui/card"
import type { InvoiceTemplateProps } from "./template-types"

export function MinimalTemplate({ data, theme }: InvoiceTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
    })
  }

  const taxAmount = (data.subtotal * (Number.parseFloat(data.taxRate) || 0)) / 100
  const discountAmount = Number.parseFloat(data.discount) || 0
  const shippingAmount = Number.parseFloat(data.shippingFee) || 0

  return (
    <Card className="w-full max-w-2xl border-none shadow-none">
      <CardContent className="p-12 space-y-12">
        {/* Simple Header */}
        <div className="text-center pb-8 border-b border-gray-200">
          {data.logo && (
            <img
              src={data.logo || "/placeholder.svg"}
              alt="Company Logo"
              className="h-8 w-auto mx-auto mb-4 object-contain opacity-80"
              crossOrigin="anonymous"
            />
          )}
          <h1 className="text-4xl font-thin text-gray-900 tracking-widest mb-2">INVOICE</h1>
          {data.invoiceNumber && (
            <div className="text-sm text-gray-500 font-light">No. {data.invoiceNumber}</div>
          )}
        </div>

        {/* Company and Client Info - Side by Side */}
        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-1">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">From</div>
            <div className="text-sm text-gray-800 leading-relaxed font-light whitespace-pre-line">
              {data.companyDetails || "Your Company Name\\nAddress Line 1\\nCity, State ZIP\\nCountry"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">To</div>
            <div className="text-sm text-gray-800 leading-relaxed font-light whitespace-pre-line">
              {data.billTo || "Client Name\\nAddress Line 1\\nCity, State ZIP\\nCountry"}
            </div>
          </div>
        </div>

        {/* Date Information */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex space-x-12">
            <div>
              <span className="text-gray-500 font-light">Date: </span>
              <span className="text-gray-800">{formatDate(data.invoiceDate)}</span>
            </div>
            {data.dueDate && (
              <div>
                <span className="text-gray-500 font-light">Due: </span>
                <span className="text-gray-800">{formatDate(data.dueDate)}</span>
              </div>
            )}
          </div>
          <div>
            <span className="text-gray-500 font-light">Currency: </span>
            <span className="text-gray-800">{data.currency}</span>
          </div>
        </div>

        {/* Line Items - Ultra Clean Table */}
        <div className="space-y-6">
          <div className="border-b border-gray-300 pb-2">
            <div className="grid grid-cols-6 gap-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
              <div className="col-span-3">Description</div>
              <div className="text-right">Qty</div>
              <div className="text-right">Rate</div>
              <div className="text-right">Total</div>
            </div>
          </div>
          <div className="space-y-4">
            {data.lineItems.map((item) => (
              <div key={item.id} className="grid grid-cols-6 gap-4 text-sm py-2">
                <div className="col-span-3 text-gray-800 font-light">
                  {item.description || "Service/Product"}
                </div>
                <div className="text-right text-gray-600 font-light">{item.quantity}</div>
                <div className="text-right text-gray-600 font-light">
                  {Number.parseFloat(item.unitCost || "0").toFixed(2)}
                </div>
                <div className="text-right text-gray-800 font-medium">
                  {data.currency === "USD" ? "$" : data.currency}{item.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals - Right Aligned, Clean */}
        <div className="flex justify-end pt-8 border-t border-gray-200">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-light">Subtotal</span>
              <span className="text-gray-800">{data.currency === "USD" ? "$" : data.currency} {data.subtotal.toFixed(2)}</span>
            </div>
            {Number.parseFloat(data.taxRate) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-light">Tax ({data.taxRate}%)</span>
                <span className="text-gray-800">{data.currency === "USD" ? "$" : data.currency} {taxAmount.toFixed(2)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-light">Discount</span>
                <span className="text-gray-800">-{data.currency === "USD" ? "$" : data.currency} {discountAmount.toFixed(2)}</span>
              </div>
            )}
            {shippingAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-light">Shipping</span>
                <span className="text-gray-800">{data.currency === "USD" ? "$" : data.currency} {shippingAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t border-gray-300">
              <span className="text-lg text-gray-900 font-light">Total</span>
              <span className="text-lg text-gray-900 font-medium">
                {data.currency === "USD" ? "$" : data.currency} {data.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        {(data.notes || data.bankDetails) && (
          <div className="pt-12 border-t border-gray-200 space-y-8">
            {data.notes && (
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Notes</div>
                <p className="text-sm text-gray-600 leading-relaxed font-light whitespace-pre-line">
                  {data.notes}
                </p>
              </div>
            )}
            {data.bankDetails && (
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Payment Details</div>
                <p className="text-sm text-gray-600 leading-relaxed font-light whitespace-pre-line">
                  {data.bankDetails}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}