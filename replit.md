# Overview

This is a React-based calculator application built with TypeScript and Vite. The project demonstrates a simple single-page application (SPA) that provides basic calculator functionality with a modern, responsive UI. The application is structured as a component-based system using the Dyad framework conventions.

**Recent Migration (Oct 14, 2025)**: Successfully migrated from Vercel to Replit with proper server configuration (0.0.0.0:5000) for Replit environment compatibility.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Framework
- **React 18+** with TypeScript for type safety and modern React features
- **Vite** as the build tool and development server for fast HMM (Hot Module Replacement) and optimized production builds
- **React Router** for client-side routing, with routes centralized in `src/App.tsx`
- **Single Page Application (SPA)** architecture with a catch-all 404 route handler

## Component Architecture
- **Pages-based routing**: Main pages stored in `src/pages/` directory
  - `Index.tsx`: Default landing page featuring the calculator
  - `NotFound.tsx`: 404 error page with user-friendly messaging
- **Component composition**: Reusable components in `src/components/` directory
  - Custom components: `Calculator.tsx`, `made-with-dyad.tsx`
  - UI library components: Extensive shadcn/ui component library in `src/components/ui/`
- **Layout pattern**: Components are composed and integrated into pages, which are then rendered via the router

## Styling System
- **Tailwind CSS** as the primary styling solution with extensive utility-first classes
- **CSS Variables** for theming support (light/dark mode capability via `next-themes`)
- **shadcn/ui design system**: Pre-built, accessible components with consistent styling
- **Custom CSS**: Global styles in `src/globals.css` using CSS custom properties for theme colors
- **Responsive design**: Mobile-first approach with breakpoint utilities

## State Management
- **React hooks** for local component state (useState, useEffect, etc.)
- **TanStack Query (React Query)** installed for potential server state management and data fetching
- **Context API**: Used by UI components (forms, toasts, etc.) for cross-component state sharing

## Type Safety
- **TypeScript** with relaxed compiler options for developer convenience
  - `strict: false` to allow gradual typing
  - `noImplicitAny: false` for flexibility with untyped code
  - Path aliases configured (`@/*` maps to `src/*`)
- **Type definitions**: Vite environment types and component prop types

## Code Quality
- **ESLint** configured with TypeScript support
- **React-specific linting**: React hooks rules and React Refresh plugin
- **Unused variables allowed**: `@typescript-eslint/no-unused-vars: "off"` for development flexibility

## Build and Development
- **Development server**: Runs on `0.0.0.0:5000` for Replit network accessibility
- **Package manager**: pnpm (lockfile: pnpm-lock.yaml)
- **Workflow**: "Server" workflow runs `pnpm run dev` to start the Vite dev server
- **Production builds**: Optimized via Vite with mode support (development/production)
- **Module system**: ES Modules throughout with `.tsx` and `.ts` extensions
- **Asset handling**: PostCSS with Tailwind and Autoprefixer for CSS processing

## Deployment
- **Vercel-ready**: Configuration in `vercel.json` with SPA fallback routing
- **Static hosting compatible**: Built files can be served from any static host
- **SEO considerations**: Basic robots.txt configuration for search engine indexing

## Project Conventions
- **File organization**: Strict separation of pages, components, utilities, and hooks
- **Import aliases**: `@/` prefix for clean imports from src directory
- **Component updates**: New components must be imported and used in pages to be visible
- **Router management**: All routes defined in `src/App.tsx` for centralized navigation control

# External Dependencies

## UI Component Library
- **shadcn/ui**: Complete component library pre-installed with all Radix UI primitives
  - Accordion, Alert, Avatar, Badge, Button, Calendar, Card, Carousel, Chart, Checkbox
  - Collapsible, Command, Context Menu, Dialog, Drawer, Dropdown Menu, Form
  - Hover Card, Input, Label, Menubar, Navigation Menu, Pagination, Popover
  - Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet
  - Sidebar, Skeleton, Slider, Switch, Table, Tabs, Textarea, Toast, Toggle, Tooltip
- **Radix UI**: Headless UI primitives for accessibility and behavior
- **lucide-react**: Icon library for consistent iconography

## Form Handling
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Schema validation resolvers for forms
- **Zod** (implied): Likely used for form schema validation

## Utility Libraries
- **class-variance-authority (CVA)**: Component variant management
- **clsx**: Conditional className composition
- **tailwind-merge**: Intelligent Tailwind class merging to prevent conflicts
- **date-fns**: Date manipulation and formatting utilities
- **cmdk**: Command palette/menu component

## UI Enhancement
- **embla-carousel-react**: Carousel/slider functionality
- **input-otp**: One-time password input components
- **vaul**: Drawer component primitive
- **sonner**: Toast notification system

## Development Tools
- **@dyad-sh/react-vite-component-tagger**: Dyad-specific Vite plugin for component tagging
- **@vitejs/plugin-react-swc**: React plugin using SWC for fast compilation

## State & Data
- **@tanstack/react-query**: Server state management, caching, and data synchronization

## Theming
- **next-themes**: Dark mode and theme switching support

## Potential Future Integrations
The application architecture supports adding:
- Database integration (Drizzle ORM mentioned in guidelines, though not currently implemented)
- API routes and backend services
- Authentication systems
- External API integrations