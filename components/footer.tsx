export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-violet-900/20 to-blue-900/20 backdrop-blur-sm border-t border-violet-200/20 mt-0" role="contentinfo">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* SEO-friendly content section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h5 className="text-lg font-semibold text-slate-800 mb-3">Free Invoice Generator</h5>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Create professional invoices online for free. Perfect for small businesses, freelancers, and contractors. No registration required, instant PDF download, and complete privacy protection.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="bg-slate-100 px-2 py-1 rounded">Free Forever</span>
              <span className="bg-slate-100 px-2 py-1 rounded">No Sign-up</span>
              <span className="bg-slate-100 px-2 py-1 rounded">Privacy First</span>
              <span className="bg-slate-100 px-2 py-1 rounded">Professional Templates</span>
            </div>
          </div>
          
          <div>
            <h5 className="text-lg font-semibold text-slate-800 mb-3">Perfect For</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Small business owners creating client invoices</li>
              <li>• Freelancers billing for services and projects</li>
              <li>• Contractors managing project payments</li>
              <li>• Consultants tracking billable hours</li>
              <li>• Anyone needing professional invoice templates</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600 leading-relaxed">
              Proudly created by{" "}
              <a
                href="https://twitter.com/adeelibr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
              >
                Adeel Imran
              </a>{" "}
              • Looking for a quick MVP? Contact me directly or reach out to{" "}
              <a
                href="mailto:contact@binarycodebarn.com"
                className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
              >
                contact@binarycodebarn.com
              </a>
            </p>
            <p className="text-xs text-slate-500">
              Proudly hosted on{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Vercel
              </a>{" "}
              • Powered by{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Next.js
              </a>{" "}
              • All open source ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
