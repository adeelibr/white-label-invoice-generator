/**
 * Enhanced export utilities for multiple formats (PDF, PNG, HTML)
 * Provides improved print optimization and export options
 */

export interface ExportOptions {
  format: 'pdf' | 'png' | 'html';
  filename?: string;
  quality?: number; // For PNG export (0.1 to 1.0)
  includeStyles?: boolean; // For HTML export
  paperSize?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
}

export interface InvoiceData {
  invoiceNumber: string;
  companyDetails: string;
  billTo: string;
  [key: string]: any;
}

/**
 * Generate optimized print styles for invoices
 */
export function generatePrintStyles(): string {
  return `
    <style>
      /* Print-specific styles */
      @media print {
        body { 
          margin: 0; 
          padding: 0; 
          font-size: 12pt; 
          line-height: 1.4;
          color: #000;
          background: white !important;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .no-print {
          display: none !important;
        }
        
        .invoice-container {
          max-width: none !important;
          margin: 0 !important;
          padding: 20px !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        h1, h2, h3 {
          page-break-after: avoid;
        }
        
        .invoice-table {
          border-collapse: collapse;
          width: 100%;
        }
        
        .invoice-table th,
        .invoice-table td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        
        .invoice-header {
          margin-bottom: 30px;
        }
        
        .invoice-footer {
          margin-top: 30px;
          border-top: 2px solid #000;
          padding-top: 20px;
        }
      }
      
      /* Enhanced styles for better visual hierarchy */
      .invoice-title {
        font-size: 28pt;
        font-weight: bold;
        color: #2563eb;
        margin-bottom: 10px;
      }
      
      .invoice-number {
        font-size: 14pt;
        font-weight: 600;
        color: #4b5563;
      }
      
      .company-details, .bill-to {
        font-size: 11pt;
        line-height: 1.5;
      }
      
      .line-items-table {
        margin: 20px 0;
      }
      
      .total-section {
        background-color: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
      }
      
      .total-amount {
        font-size: 16pt;
        font-weight: bold;
        color: #059669;
      }
    </style>
  `;
}

/**
 * Export invoice as PDF using browser's print functionality
 */
export async function exportToPDF(
  invoiceElement: HTMLElement,
  options: ExportOptions = { format: 'pdf' }
): Promise<void> {
  try {
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    
    if (!printWindow) {
      throw new Error('Please allow popups to download the invoice');
    }

    // Get all stylesheets from the current document
    const stylesheets = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch (e) {
          // Handle cross-origin stylesheets
          return '';
        }
      })
      .join('\n');

    const invoiceHtml = invoiceElement.innerHTML;
    const filename = options.filename || 'invoice';

    // Enhanced HTML structure for better printing
    const printHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${filename}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
          ${generatePrintStyles()}
          <style>
            ${stylesheets}
          </style>
        </head>
        <body>
          <div class="invoice-container max-w-4xl mx-auto">
            ${invoiceHtml}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for content and styles to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Export invoice as PNG image
 */
export async function exportToPNG(
  invoiceElement: HTMLElement,
  options: ExportOptions = { format: 'png', quality: 0.95 }
): Promise<void> {
  try {
    // Check if html2canvas is available
    if (typeof window === 'undefined' || !(window as any).html2canvas) {
      throw new Error('PNG export requires html2canvas library');
    }

    const html2canvas = (window as any).html2canvas;
    const filename = options.filename || 'invoice.png';
    const quality = options.quality || 0.95;

    // Create canvas from element
    const canvas = await html2canvas(invoiceElement, {
      scale: 2, // High resolution
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: invoiceElement.offsetWidth,
      height: invoiceElement.offsetHeight
    });

    // Convert to blob and download
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }, 'image/png', quality);
  } catch (error) {
    console.error('Error generating PNG:', error);
    throw new Error('Failed to generate PNG. Please try again.');
  }
}

/**
 * Export invoice as HTML file
 */
export async function exportToHTML(
  invoiceElement: HTMLElement,
  options: ExportOptions = { format: 'html', includeStyles: true }
): Promise<void> {
  try {
    const filename = options.filename || 'invoice.html';
    const includeStyles = options.includeStyles !== false;

    let stylesheets = '';
    
    if (includeStyles) {
      // Collect all stylesheets
      stylesheets = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');
    }

    const invoiceHtml = invoiceElement.innerHTML;

    // Complete HTML structure
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Invoice</title>
          <script src="https://cdn.tailwindcss.com"></script>
          ${includeStyles ? `<style>${stylesheets}</style>` : ''}
        </head>
        <body class="bg-gray-50 py-8">
          <div class="max-w-4xl mx-auto bg-white shadow-lg">
            ${invoiceHtml}
          </div>
        </body>
      </html>
    `;

    // Create and download HTML file
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw new Error('Failed to generate HTML file. Please try again.');
  }
}

/**
 * Universal export function that routes to appropriate format handler
 */
export async function exportInvoice(
  invoiceElement: HTMLElement,
  options: ExportOptions
): Promise<void> {
  switch (options.format) {
    case 'pdf':
      return exportToPDF(invoiceElement, options);
    case 'png':
      return exportToPNG(invoiceElement, options);
    case 'html':
      return exportToHTML(invoiceElement, options);
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
}

/**
 * Generate filename with timestamp and format
 */
export function generateFilename(invoiceData: InvoiceData, format: string): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const invoiceNumber = invoiceData.invoiceNumber || 'draft';
  const cleanInvoiceNumber = invoiceNumber.replace(/[^a-zA-Z0-9]/g, '-');
  
  return `invoice-${cleanInvoiceNumber}-${timestamp}.${format}`;
}

/**
 * Validate export options
 */
export function validateExportOptions(options: ExportOptions): { isValid: boolean; error?: string } {
  if (!options.format) {
    return { isValid: false, error: 'Export format is required' };
  }

  const validFormats = ['pdf', 'png', 'html'];
  if (!validFormats.includes(options.format)) {
    return { isValid: false, error: `Invalid format. Supported formats: ${validFormats.join(', ')}` };
  }

  if (options.quality && (options.quality < 0.1 || options.quality > 1.0)) {
    return { isValid: false, error: 'Quality must be between 0.1 and 1.0' };
  }

  return { isValid: true };
}

/**
 * Check browser compatibility for export formats
 */
export function checkExportCompatibility(): {
  pdf: boolean;
  png: boolean;
  html: boolean;
} {
  return {
    pdf: typeof window !== 'undefined' && typeof window.print === 'function',
    png: typeof window !== 'undefined' && !!(window as any).html2canvas,
    html: typeof window !== 'undefined' && typeof Blob !== 'undefined'
  };
}