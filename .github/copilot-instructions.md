# White Label Invoice Generator

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

White Label Invoice Generator is a Next.js 15 application with React 19, TypeScript, and Tailwind CSS that creates professional invoices with real-time preview, automatic calculations, and theme customization.

## Working Effectively

### Bootstrap and Dependencies
- **Install pnpm globally**: `npm install -g pnpm` (required - npm install fails)
- **Install dependencies**: `pnpm install` -- takes ~12 seconds. NEVER CANCEL.
- **Alternative fallback**: `npm install --legacy-peer-deps` -- may fail with network restrictions

### Development Server
- **Start development**: `pnpm dev` -- ready in ~1.4 seconds
- **Access application**: http://localhost:3000
- **Alternative commands**: `npm run dev` (if pnpm unavailable)

### Build Process  
- **Production build**: `pnpm build` -- **FAILS in network-restricted environments** due to Google Fonts API access (fonts.googleapis.com)
- **Expected error**: "Failed to fetch fonts from Google Fonts" - this is normal in firewall-limited environments
- **Build time estimate**: ~30 seconds when network access available
- **NEVER CANCEL builds** - they may take several minutes

### Linting and Code Quality
- **First-time lint setup**: `pnpm lint` -- takes ~2.5 minutes to configure ESLint. NEVER CANCEL. Set timeout to 5+ minutes.
- **Subsequent linting**: `pnpm lint` -- takes ~3 seconds  
- **Expected warnings**: Unescaped quotes, missing dependencies, img vs Image usage - these are acceptable

## Validation Scenarios

**CRITICAL**: Always manually test these scenarios after making changes:

### Complete Invoice Creation Flow
1. **Fill company details**: Enter multi-line company information in "Your company details"
2. **Add client information**: Enter client details in "Bill to" field
3. **Create line items**: Add description, unit cost, and quantity
4. **Verify calculations**: Check that Amount = Unit Cost × Quantity and Total updates automatically
5. **Test theme customization**: Click "Customize" button and verify modal opens with color/font options
6. **Test PDF generation**: Click "Create & Download Invoice" - should trigger browser print dialog

### Real-time Preview Testing
- **Automatic updates**: Verify right-side preview updates instantly when form changes
- **Calculation accuracy**: Test various quantities and prices (e.g., 10 × $150 = $1500)
- **Currency display**: Ensure proper formatting with USD symbols
- **Theme changes**: Verify preview updates when switching themes

## Common File Locations

### Key Application Files
- `app/page.tsx` - Main application entry point
- `components/invoice-generator.tsx` - Core invoice form and logic  
- `components/invoice-preview.tsx` - Real-time invoice preview
- `components/theme-settings.tsx` - Theme customization modal
- `app/layout.tsx` - Root layout with Google Fonts imports
- `app/globals.css` - Global styles and theme variables

### Configuration Files
- `package.json` - Dependencies and scripts
- `next.config.mjs` - Next.js configuration (ignores ESLint/TypeScript errors during build)
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint rules (auto-generated on first lint run)
- `components.json` - shadcn/ui component configuration

### Project Structure
```
├── app/                 # Next.js app directory
│   ├── page.tsx        # Main application page
│   ├── layout.tsx      # Root layout with fonts
│   └── globals.css     # Global styles and themes
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── invoice-generator.tsx  # Main form component
│   ├── invoice-preview.tsx    # Preview component
│   └── theme-settings.tsx     # Theme customization
├── lib/                # Utility functions
│   └── utils.ts        # Tailwind utilities
└── public/             # Static assets
```

## Known Issues and Workarounds

### Build Failures
- **Problem**: Build fails with "Failed to fetch fonts from Google Fonts" 
- **Cause**: Network firewall restrictions blocking fonts.googleapis.com
- **Workaround**: Development server works fine; build issue only affects production builds in restricted environments
- **DO NOT**: Modify font imports - this will break theme functionality

### Package Manager Issues  
- **Problem**: `npm install` may fail
- **Solution**: Always use `pnpm install` 
- **Fallback**: `npm install --legacy-peer-deps`

### ESLint Warnings
- **Expected warnings**: React unescaped entities, missing dependencies, img element usage
- **Action**: These warnings are acceptable and don't break functionality
- **Critical errors only**: Focus on fixing TypeScript errors and runtime issues

## Architecture Notes

### State Management
- Uses React useState for form data and calculations
- Local storage for theme preferences  
- No external state management library

### Styling System
- Tailwind CSS with custom CSS variables for themes
- shadcn/ui components with Radix UI primitives
- Dynamic theme switching via CSS variable updates

### Key Features
- **Real-time calculations**: Automatic totals, tax, and discount calculations
- **PDF generation**: Uses browser print API to generate PDFs
- **Theme system**: 5 color schemes × 5 font pairings = 25 theme combinations
- **Logo upload**: File validation (JPG/PNG, max 5MB)
- **Multi-currency**: USD default with currency symbol formatting

## Performance Notes

### Timing Expectations
- **Dependency installation**: 12 seconds (pnpm) 
- **Development server startup**: 1.4 seconds
- **ESLint first run**: 2.5 minutes (setup) 
- **ESLint subsequent runs**: 3 seconds
- **Build time**: 30 seconds (when network available)

### Resource Requirements
- **Node.js**: 18+ required
- **Memory**: Standard Next.js requirements
- **Network**: Required for Google Fonts during build (not for development)

## Testing Strategy

Since no automated test suite exists:

1. **Always test development server** after changes: `pnpm dev`
2. **Always test core invoice flow** after significant changes
3. **Always run linting** before committing: `pnpm lint`
4. **Manual validation required** for all UI changes
5. **Test theme switching** when modifying styles
6. **Verify calculations** when changing form logic

## Development Workflow

### Making Changes
1. Start development server: `pnpm dev`
2. Make changes to components or styles
3. Test functionality manually using validation scenarios above
4. Run linting: `pnpm lint` 
5. Fix critical ESLint errors (ignore warnings)
6. Test complete invoice creation flow before committing

### Component Development
- **Form components**: Focus on `components/invoice-generator.tsx`
- **Preview updates**: Modify `components/invoice-preview.tsx`  
- **Theme system**: Update `components/theme-settings.tsx` and CSS variables
- **Styling**: Add/modify Tailwind classes, avoid custom CSS when possible

Always reference these instructions first rather than searching or using bash commands to discover basic setup and workflow information.