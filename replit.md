# Overview

This is an event discovery platform built with React, TypeScript, and Vite. The app features a Tinder-style swipe interface where users can discover nightlife events, clubs, and entertainment venues. Users can swipe through events, like them, and admins can create new events through a dedicated dashboard. The application uses a dark theme throughout for an immersive nightlife experience.

**Recent Rebuild (Oct 14, 2025)**: Completely rebuilt from a calculator app to an event discovery platform with swipe functionality, localStorage persistence, and admin capabilities.

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
- **localStorage Persistence**: All events and liked status persist across sessions
- **Zod Validation**: Type-safe event schema validation
- **Mock Seed Data**: 6 pre-populated events with real Unsplash images for demo purposes

## Event Data Model
Events include:
- ID (unique identifier)
- Name
- Description
- Location
- Price
- Date & Time
- Image URL
- Liked status (boolean)

## Component Architecture
- **Pages**:
  - `EventDiscovery.tsx`: Main swipe interface with event cards
  - `Admin.tsx`: Admin dashboard with event creation form
- **Context**:
  - `EventContext.tsx`: Global state for events with localStorage sync
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
- **events**: Array of all events with liked status
- **Automatic Sync**: Updates on every event change
- **Initial Load**: Seeds with mock data if empty

# External Dependencies

## Core Libraries
- **react-tinder-card**: Tinder-style swipe card component
- **@react-spring/web**: Spring-based animation library
- **react-router-dom**: Client-side routing
- **zod**: Schema validation and type inference

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
✅ localStorage persistence
✅ Dark theme
✅ Mock seed events
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
