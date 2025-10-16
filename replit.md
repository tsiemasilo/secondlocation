# Overview

This is an event discovery platform built with React, TypeScript, and Vite. The app features a Tinder-style swipe interface where users can discover nightlife events, clubs, and entertainment venues. Users can swipe through events, like them, and admins can create new events through a dedicated dashboard. The application uses a dark theme throughout for an immersive nightlife experience.

**Recent Rebuild (Oct 14, 2025)**: Completely rebuilt from a calculator app to an event discovery platform with swipe functionality, localStorage persistence, and admin capabilities.

**Latest Update (Oct 16, 2025)**: Integrated Ticketmaster API for real live events and changed currency from USD to South African Rands (ZAR).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Functionality
- **Event Discovery**: Tinder-style swipeable cards showing nightlife events
- **Like System**: Users can like events by swiping right or clicking the heart button
- **Unlike Capability**: Users can unlike events from the liked events drawer
- **Admin Dashboard**: Dedicated interface for creating and posting new events
- **Dark Theme**: Consistent dark theme optimized for nightlife/club aesthetics

## Frontend Framework
- **React 18+** with TypeScript for type safety and modern React features
- **Vite** as the build tool and development server for fast HMR
- **React Router** for client-side routing (/ for discovery, /admin for dashboard)
- **Single Page Application (SPA)** architecture

## Data Management
- **Event Context**: React Context API for centralized event state management
- **Ticketmaster API**: Real-time event data from Ticketmaster Discovery API (5,000 free calls/day)
- **localStorage Persistence**: Liked events persist across sessions using event IDs
- **Zod Validation**: Type-safe event schema validation
- **Currency Handling**: Automatic USD to ZAR conversion (18.5 rate), with currency detection
- **Fallback Data**: Mock events used if API fails to load

## Event Data Model
Events include:
- ID (unique identifier from Ticketmaster)
- Name
- Description
- Location (venue name, city, state/province)
- Price (displayed in South African Rands - ZAR)
- Date & Time (ISO 8601 format)
- Image URL (from Ticketmaster event images)
- Liked status (boolean, persisted in localStorage)

## Component Architecture
- **Pages**:
  - `EventDiscovery.tsx`: Main swipe interface with event cards and loading states
  - `Admin.tsx`: Admin dashboard with event creation form
- **Services**:
  - `ticketmaster.ts`: API integration service for fetching live events
- **Context**:
  - `EventContext.tsx`: Global state for events with API integration and localStorage sync
- **UI Components**: Extensive shadcn/ui component library
  - Cards, Buttons, Forms, Sheets (drawers), Input fields, Date pickers

## Swipe Functionality
- **react-tinder-card**: Library providing smooth swipe gestures
- **@react-spring/web**: Animation library (peer dependency)
- **Swipe Directions**: Right to like, Left to skip
- **Manual Controls**: Heart and X buttons for non-swipe interactions
- **Card Stack**: Events displayed in reverse order, swiped off the stack

## Styling System
- **Tailwind CSS** as the primary styling solution
- **Dark Theme**: Gradient backgrounds (gray-900 to black), dark cards, and light text
- **Responsive Design**: Mobile-first approach with max-width constraints
- **Custom Styling**: Dark overlays on event images for text readability

## State Management
- **React Context API** for global event state
- **localStorage** for persistence
- **React hooks** for local component state
- **Derived State**: Liked events computed from main events array

## Form Handling
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Zod integration for schema validation
- **Controlled Inputs**: All form fields controlled with validation feedback

## Type Safety
- **TypeScript** with Zod schemas for runtime validation
- **Type definitions**: Event types, form types, context types
- **Path aliases**: `@/*` maps to `src/*`

## Code Quality
- **ESLint** configured with TypeScript support
- **React-specific linting**: React hooks rules and React Refresh plugin
- **Type validation**: Zod schemas for event data

## Build and Development
- **Development server**: Runs on `0.0.0.0:5000` for Replit network accessibility
- **Allowed Hosts**: Configured to accept Replit's dynamic preview domains
- **Package manager**: pnpm (lockfile: pnpm-lock.yaml)
- **Workflow**: "Server" workflow runs `pnpm run dev` to start the Vite dev server
- **Hot Module Replacement**: Instant updates during development
- **Production builds**: Optimized via Vite with tree-shaking and code splitting

## Routing Structure
- `/` - Event Discovery page (main app interface)
- `/admin` - Admin Dashboard (event creation)
- Navigation via React Router with Link components

## localStorage Schema
- **event_discovery_liked**: Set of liked event IDs (persists user preferences)
- **Automatic Sync**: Updates on every like/unlike action
- **Initial Load**: Fetches live events from Ticketmaster API on app start

# External Dependencies

## Core Libraries
- **react-tinder-card**: Tinder-style swipe card component
- **@react-spring/web**: Spring-based animation library
- **react-router-dom**: Client-side routing
- **zod**: Schema validation and type inference

## External APIs
- **Ticketmaster Discovery API**: Live event data from South Africa and globally
  - Free tier: 5,000 API calls/day, 5 requests/second
  - Returns events with pricing, venue info, dates, and images
  - API key stored in TICKETMASTER_API_KEY environment variable

## UI Component Library
- **shadcn/ui**: Complete component library with Radix UI primitives
- **lucide-react**: Icon library (Heart, X, Calendar, MapPin, DollarSign, Menu)

## Form Handling
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Schema validation resolvers

## Utility Libraries
- **date-fns**: Date formatting and manipulation
- **tailwind-merge**: Intelligent Tailwind class merging
- **clsx**: Conditional className composition
- **class-variance-authority**: Component variant management

## Theming
- **Tailwind CSS**: Utility-first CSS framework
- **Dark mode**: Always enabled via className="dark" on root

## Development Tools
- **@dyad-sh/react-vite-component-tagger**: Dyad-specific Vite plugin
- **@vitejs/plugin-react-swc**: React plugin using SWC for fast compilation

# Feature Roadmap

## Current Features (Implemented)
✅ Event discovery with swipe interface
✅ Like/unlike events functionality
✅ Liked events drawer
✅ Admin dashboard for creating events
✅ localStorage persistence (liked events only)
✅ Dark theme
✅ **Real live events from Ticketmaster API**
✅ **Prices displayed in South African Rands (ZAR)**
✅ **Currency conversion (USD to ZAR) with detection**
✅ Loading states for API calls
✅ Fallback to mock data if API fails
✅ Responsive design

## Future Enhancements (Not Implemented)
- User authentication and profiles
- Backend API integration
- Database storage (PostgreSQL)
- Real-time event updates
- Event categories/filtering
- Search functionality
- Social sharing
- Event check-ins
- User reviews and ratings
- Push notifications
- Map integration for venue locations
- Ticket purchasing integration
