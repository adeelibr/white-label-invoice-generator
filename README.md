# White Label Invoice Generator 🧾✨

A beautiful, modern invoice generator built with Next.js 15, React 19, and Tailwind CSS. Create professional invoices with customizable themes and branding in seconds!

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/adeel-imran/v0-white-label-invoice-generator)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/MiLP8qUNMBB)

## 🚀 What is this?

This is a **free, open-source invoice generator** that helps you create professional invoices quickly and easily. Perfect for freelancers, small businesses, and anyone who needs to create invoices without the hassle of complex software.

## ✨ Core Features

### 📄 Invoice Creation & Management
- **Real-time Invoice Preview** - See your invoice update instantly as you type
- **Professional Templates** - 7 beautifully designed templates:
  - **Classic** - Traditional professional layout with clear sections
  - **Modern** - Contemporary design with colored headers and clean lines
  - **Professional** - Corporate-style layout perfect for B2B transactions
  - **Creative** - Fun and colorful design with playful elements
  - **Minimal** - Ultra-clean design with lots of whitespace
  - **Elegant** - Sophisticated design with ornamental elements
  - **Bold** - High-impact design with strong visual elements
- **Line Item Management** - Add unlimited items with automatic calculations
- **Multi-line Company Details** - Full support for complex address formatting
- **Client Information Management** - Store and organize client details

### 🎨 Theme Customization
- **25 Theme Combinations** - Mix and match colors and fonts:
  - **5 Color Schemes**: Violet & Blue, Emerald & Teal, Rose & Pink, Orange & Amber, Indigo & Purple
  - **5 Font Pairs**: Modern, Classic, Elegant, Minimal, Creative
- **Custom Branding** - Upload your company logo (JPG/PNG, max 5MB)
- **Persistent Preferences** - Themes saved automatically to your browser

### 🧮 Advanced Calculations
- **Automatic Totals** - Real-time calculation of subtotals and totals
- **Tax Management** - Configurable tax rates with automatic calculation
- **Discount Support** - Apply discounts with real-time updates
- **Shipping & Fees** - Add shipping costs and additional fees
- **Currency Formatting** - Professional USD formatting (extensible for other currencies)

### 🏢 Client Relationship Management (CRM)
- **Client Directory** - Organize and manage all your clients
- **Client-specific Invoices** - Track invoices by client
- **Invoice History** - View all invoices for each client
- **Client Search** - Quick search and filtering capabilities

### 📱 User Experience
- **Fully Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Welcome Screen** - Guided onboarding for new users
- **Feature Walkthrough** - Interactive tour of all capabilities
- **Intuitive Interface** - Clean, modern UI built with shadcn/ui components

### 📄 Export & Documentation
- **PDF Generation** - High-quality PDF export via browser print dialog
- **Print Optimization** - Properly formatted for A4 printing
- **Multiple Invoice Fields**:
  - Purchase Order numbers
  - Bank account details
  - Payment terms and notes
  - Invoice and due dates

### 🔐 Privacy & Data Management
- **Privacy First** - All data stays in your browser - no server storage
- **Local Storage** - Automatic saving of invoices and preferences
- **Data Persistence** - Never lose your work with automatic saves
- **No Account Required** - Start creating invoices immediately

### ⚡ Technical Features
- **Fast Performance** - Built with Next.js 15 and React 19
- **Modern Technology Stack** - TypeScript, Tailwind CSS, and latest web standards
- **Accessibility** - Built with accessibility best practices
- **Cross-browser Compatible** - Works on all modern browsers

## 🚀 How to Use

### Getting Started
1. **Visit the App** - Open the invoice generator in your browser
2. **Complete Onboarding** (optional) - Take the guided tour to learn all features
3. **Choose a Template** - Select from 7 professional templates
4. **Customize Theme** - Pick your preferred colors and fonts

### Creating Your First Invoice
1. **Add Company Details** - Enter your business information and upload logo
2. **Enter Client Information** - Add your client's details in the "Bill to" section
3. **Add Line Items** - Include services/products with:
   - Description
   - Unit cost
   - Quantity (automatically calculates amount)
4. **Configure Calculations** - Set tax rates, discounts, and shipping fees
5. **Add Payment Details** - Include bank details and payment terms
6. **Generate PDF** - Click "Create & Download Invoice" to export

### Advanced Features
- **Save Clients** - Use the CRM features to store frequently used client information
- **Template Switching** - Change templates anytime to match different client needs
- **Theme Customization** - Access the theme modal to create your perfect brand look
- **Data Persistence** - All your work is automatically saved locally

## 🛠️ Troubleshooting & Known Issues

### Common Issues and Solutions

#### PDF Generation
- **Issue**: "Please allow popups to download the invoice"
- **Solution**: Enable popups for the website in your browser settings
- **Alternative**: Use Ctrl+P (Cmd+P on Mac) to print/save as PDF

#### Logo Upload
- **Supported Formats**: JPG, PNG only
- **File Size Limit**: Maximum 5MB
- **Issue**: Logo not displaying
- **Solution**: Ensure file is under 5MB and in supported format

#### Browser Compatibility
- **Recommended**: Chrome, Firefox, Safari, Edge (latest versions)
- **Issue**: Features not working properly
- **Solution**: Update to the latest browser version and enable JavaScript

#### Data Storage
- **Location**: All data stored in browser's localStorage
- **Backup**: No automatic cloud backup - data stays on your device
- **Clearing Data**: Clearing browser data will remove saved invoices and themes

### Build Issues (For Developers)
- **Network Restrictions**: Build may fail in firewall-limited environments due to Google Fonts API
- **Package Manager**: Use `pnpm install` instead of `npm install` for best compatibility
- **Alternative**: `npm install --legacy-peer-deps` if pnpm unavailable

## 🎯 Live Demo

Try it out: **[https://vercel.com/adeel-imran/v0-white-label-invoice-generator](https://vercel.com/adeel-imran/v0-white-label-invoice-generator)**

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe JavaScript development

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Radix UI** - Low-level UI primitives for accessibility
- **Lucide React** - Beautiful & consistent icon library

### Key Dependencies
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema declaration and validation
- **date-fns** - Modern JavaScript date utility library
- **Next Themes** - Theme management for Next.js apps

### Development Tools
- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting (configured with Next.js)
- **PostCSS** - CSS processing and optimization

### Deployment
- **Vercel** - Optimized hosting platform for Next.js
- **GitHub Actions** - CI/CD pipeline integration

## 🏃‍♂️ Quick Start

Want to run this locally or contribute? Here's how:

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/adeelibr/white-label-invoice-generator.git
   cd white-label-invoice-generator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤝 Contributing

We'd love your help making this invoice generator even better! Here's how you can contribute:

### 🐛 Found a bug or want a feature?
- Open an issue describing the bug or feature request
- Include screenshots if it's a UI issue
- Provide steps to reproduce for bugs

### 💻 Want to contribute code?

1. **Fork this repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Keep changes focused and atomic
   - Follow the existing code style
   - Add comments for complex logic
4. **Test your changes**
   ```bash
   pnpm build && pnpm start
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push and create a pull request**
   ```bash
   git push origin feature/amazing-feature
   ```

### 🎨 Code Style Guidelines

- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling (avoid custom CSS when possible)
- Use shadcn/ui components for consistency
- Write self-documenting code with clear variable names

### 💡 Ideas for contributions

- 🌍 **Internationalization**: Add support for multiple languages
- 🎨 **New Themes**: Create additional color schemes and layouts
- 📊 **Templates**: Add pre-built invoice templates for different industries
- 🔧 **Features**: Recurring invoices, client management, invoice tracking
- 📱 **Mobile UX**: Improve mobile experience
- ♿ **Accessibility**: Enhance accessibility features
- 🧪 **Testing**: Add unit and integration tests

## 📖 Project Structure

```
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Main application entry point
│   ├── layout.tsx               # Root layout with fonts and themes
│   ├── globals.css              # Global styles and theme variables
│   └── blog/                    # Blog functionality
├── components/                   # React components
│   ├── ui/                      # shadcn/ui base components
│   ├── templates/               # Invoice template designs
│   │   ├── classic-template.tsx
│   │   ├── modern-template.tsx
│   │   ├── professional-template.tsx
│   │   ├── creative-template.tsx
│   │   ├── minimal-template.tsx
│   │   ├── elegant-template.tsx
│   │   └── bold-template.tsx
│   ├── crm/                     # Client relationship management
│   │   ├── clients-directory.tsx
│   │   ├── client-overview.tsx
│   │   └── crm-invoice-generator.tsx
│   ├── invoice-generator.tsx    # Main invoice form logic
│   ├── invoice-preview.tsx      # Real-time preview component
│   ├── dynamic-invoice-preview.tsx # Template switching logic
│   ├── theme-settings.tsx       # Theme customization modal
│   ├── template-selection.tsx   # Template picker interface
│   ├── onboarding-flow.tsx      # User onboarding system
│   ├── welcome-screen.tsx       # Welcome screen component
│   ├── feature-walkthrough.tsx  # Interactive feature tour
│   ├── header.tsx              # Application header
│   ├── hero-section.tsx        # Landing page hero
│   └── footer.tsx              # Application footer
├── lib/                         # Utility functions and storage
│   ├── storage/                 # Local storage management
│   │   ├── invoiceStorage.ts   # Invoice data persistence
│   │   ├── settingsStorage.ts  # Theme and app settings
│   │   ├── clientStorage.ts    # CRM client data
│   │   └── userStorage.ts      # User session management
│   └── utils.ts                # Tailwind utilities
├── content/                     # Blog content (Markdown)
├── public/                      # Static assets
└── styles/                      # Additional stylesheets
```

### Key Components Explained

- **InvoiceGenerator**: Core form component handling all invoice data and logic
- **DynamicInvoicePreview**: Handles template switching and renders appropriate template
- **Templates**: 7 different visual layouts for invoices, each with unique styling
- **ThemeSettings**: Modal for customizing colors and fonts with live preview
- **CRM Components**: Full client management system with data persistence
- **Storage Layer**: Comprehensive localStorage abstraction for all app data

## 🔄 Development Integration

*This project is built with [v0.app](https://v0.app) and automatically syncs with deployments.*

Continue building: **[https://v0.app/chat/projects/MiLP8qUNMBB](https://v0.app/chat/projects/MiLP8qUNMBB)**

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ by [Adeel](https://github.com/adeelibr) and the open source community