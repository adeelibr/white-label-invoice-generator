# Contributing to White Label Invoice Generator

Thank you for your interest in contributing to the White Label Invoice Generator! This document provides guidelines and information about how to contribute to this project.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Code of Conduct](#code-of-conduct)

## 🚀 Project Overview

The White Label Invoice Generator is a modern, responsive web application built with Next.js that allows users to create professional invoices with customizable branding. The application features:

- **Modern UI/UX**: Built with React 19, Next.js 15, and Tailwind CSS
- **Component Architecture**: Uses shadcn/ui components for consistent design
- **TypeScript**: Fully typed for better developer experience
- **Invoice Generation**: Create, customize, and export professional invoices
- **Theme Support**: Multiple themes and customizable branding options
- **Print/PDF Support**: Export invoices as PDF or print directly

## 🛠 Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm** or **pnpm**: Latest stable version
- **Git**: For version control

### Development Setup

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/white-label-invoice-generator.git
   cd white-label-invoice-generator
   ```

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Setup

The project may require environment variables for full functionality:

```bash
# Copy environment template (if exists)
cp .env.example .env.local

# Edit .env.local with your configuration
```

## 📝 Code Style Guidelines

### TypeScript Standards

- Use **strict TypeScript** - all type errors must be resolved
- Prefer **interfaces** over types for object definitions
- Use **explicit return types** for functions
- Avoid `any` type - use proper typing or `unknown`

### React/Next.js Conventions

- Use **functional components** with hooks
- Follow **Next.js App Router** conventions
- Implement **proper error boundaries** where needed
- Use **React.forwardRef** for reusable components that need refs

### Component Structure

```tsx
// Good component structure
import React from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  title: string
  children?: React.ReactNode
  className?: string
}

export function Component({ title, children, className }: ComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### Styling Guidelines

- Use **Tailwind CSS** for styling
- Leverage **CSS custom properties** for theme variables
- Use the **cn()** utility function for conditional classes
- Follow **mobile-first** responsive design principles

### File Organization

```
/app                 # Next.js App Router pages
/components          # Reusable React components
  /ui               # Basic UI components (shadcn/ui)
  *.tsx             # Feature-specific components
/lib                 # Utility functions and configurations
/styles             # Global styles and Tailwind config
/public             # Static assets
```

## 🔧 Making Changes

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `chore/description` - Maintenance tasks

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(invoice): add dark mode support
fix(ui): resolve button hover states
docs(readme): update installation instructions
style(components): improve accessibility
refactor(utils): optimize date formatting
test(invoice): add unit tests for calculations
```

### Development Workflow

1. **Create a feature branch** from main
2. **Make your changes** following the code style guidelines
3. **Test your changes** locally
4. **Run linting** and fix any issues
5. **Commit your changes** with descriptive messages
6. **Push your branch** and create a pull request

## 🧪 Testing

### Running Tests

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint -- --fix

# Build the project to check for TypeScript errors
npm run build
```

### Testing Guidelines

- **Manual testing**: Test your changes in the browser
- **Cross-browser testing**: Ensure compatibility with major browsers
- **Responsive testing**: Verify functionality on different screen sizes
- **Accessibility testing**: Check keyboard navigation and screen reader compatibility

### What to Test

- **Invoice generation** functionality
- **Theme switching** and customization
- **Form validation** and error handling
- **Print/PDF export** features
- **Responsive design** on mobile devices

## 📬 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All TypeScript errors resolved
- [ ] Linting passes without errors
- [ ] Manual testing completed
- [ ] Documentation updated (if needed)

### Pull Request Template

When creating a pull request, include:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Responsive design verified

## Screenshots (if applicable)
Add screenshots showing the changes.

## Additional Notes
Any additional information or context.
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Manual testing** of changes
4. **Merge** once approved

## 🐛 Issue Reporting

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check the documentation and README
- Try the latest version of the application

### Issue Template

```markdown
## Bug Report / Feature Request

### Description
Clear description of the issue or feature request.

### Steps to Reproduce (for bugs)
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### Expected Behavior
What you expected to happen.

### Actual Behavior
What actually happened.

### Environment
- Browser: [e.g., Chrome 120]
- Device: [e.g., Desktop, iPhone 12]
- Screen Size: [e.g., 1920x1080]

### Additional Context
Add any other context about the problem.
```

## 📜 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Be collaborative** and constructive
- **Be patient** with newcomers
- **Be professional** in all interactions

### Unacceptable Behavior

- Harassment or discrimination
- Offensive language or content
- Spam or irrelevant content
- Violation of privacy

### Enforcement

Instances of abusive behavior may result in temporary or permanent exclusion from the project community.

## 🤝 Getting Help

### Community Support

- **GitHub Discussions**: For questions and community support
- **Issues**: For bug reports and feature requests
- **Discord/Slack**: Community chat (if available)

### Maintainer Contact

- **GitHub**: [@adeelibr](https://github.com/adeelibr)
- **Twitter**: [@adeelibr](https://twitter.com/adeelibr)
- **Email**: contact@binarycodebarn.com

## 🙏 Recognition

All contributors will be recognized in our project documentation. We appreciate your time and effort in making this project better!

---

Thank you for contributing to the White Label Invoice Generator! 🎉