export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-violet-900/20 to-blue-900/20 backdrop-blur-sm border-t border-violet-200/20 mt-0">
      <div className="max-w-4xl mx-auto px-6 py-8">
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
    </footer>
  )
}
