# Overview

This is an event discovery platform built with React, TypeScript, and Vite. The app features a Tinder-style swipe interface where users can discover nightlife events, clubs, and entertainment venues. Users can swipe through events, like them, and admins can create new events through a dedicated dashboard. The application uses a dark theme throughout for an immersive nightlife experience.

**Recent Rebuild (Oct 14, 2025)**: Completely rebuilt from a calculator app to an event discovery platform with swipe functionality, localStorage persistence, and admin capabilities.

**Latest Update (Oct 16, 2025)**: 
- Integrated Ticketmaster API for real live events
- Changed currency from USD to South African Rands (ZAR)
- Added PostgreSQL database integration with Drizzle ORM
- Implemented Netlify serverless functions for database API
- Liked events now persist in PostgreSQL (dev and production databases)
- **Comprehensive Filtering System**: Filter by category, date range, price range, location radius, and popularity
- **Smart Search**: Autocomplete search with suggestions for events, categories, and locations
- **Advanced Sorting**: Sort by date (upcoming/latest), price (low/high), popularity, and distance
- **Price Accuracy Fix**: Updated USD to ZAR exchange rate from 18.5 to 17.32 (current rate)
- **Realistic Venue Pricing**: Added estimated cover charges for nightclubs (R150), bars (R50), based on ratings

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Functionality
- **Event Discovery**: Tinder-style swipeable cards showing nightlife events
- **Like System**: Users can like events by swiping right or clicking the heart button
- **Unlike Capability**: Users can unlike events from the liked events drawer
- **Admin Dashboard**: Dedicated interface for creating and posting new events
- **Dark Theme**: Consistent dark theme optimized for nightlife/club aesthetics
- **Advanced Filtering**: Multi-criteria filtering by category, price, date, location, and rating
- **Smart Search**: Autocomplete search bar with real-time suggestions
- **Flexible Sorting**: Multiple sort options including date, price, popularity, and distance

## Frontend Framework
- **React 18+** with TypeScript for type safety and modern React features
- **Vite** as the build tool and development server for fast HMR
- **React Router** for client-side routing (/ for discovery, /admin for dashboard)
- **Single Page Application (SPA)** architecture

## Data Management
- **Event Context**: React Context API for centralized event state management
- **Ticketmaster API**: Real-time event data from Ticketmaster Discovery API (5,000 free calls/day)
- **PostgreSQL Database**: Liked events stored in PostgreSQL with per-session persistence
- **Database ORM**: Drizzle ORM for type-safe database queries
- **Serverless API**: Netlify serverless functions for database CRUD operations
- **Session Management**: Unique session IDs for multi-user support
- **localStorage Fallback**: Graceful fallback to localStorage when database API unavailable
- **Zod Validation**: Type-safe event schema validation
- **Currency Handling**: Automatic USD to ZAR conversion (17.32 rate - current exchange rate), with currency detection
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
- Category (music, nightclub, bar, restaurant, sports, comedy, theater, festival, event)
- Coordinates (lat/lng for distance-based filtering and sorting)
- Popularity (rating/popularity score for sorting and filtering)

## Component Architecture
- **Pages**:
  - `EventDiscovery.tsx`: Main swipe interface with event cards, search, filters, sorting, and loading states
  - `Admin.tsx`: Admin dashboard with event creation form
- **Services**:
  - `ticketmaster.ts`: API integration service for fetching live events with category detection
  - `googlePlaces.ts`: Venue data with realistic pricing based on category and ratings
  - Other API services: eventbrite, foursquare, yelp, computicket
- **Context**:
  - `EventContext.tsx`: Enhanced global state with filtering, search, and sorting logic
- **Filter & Search Components**:
  - `FilterBar.tsx`: Comprehensive filter controls (category, price, date, radius, rating)
  - `SearchBar.tsx`: Smart search with autocomplete suggestions
  - `SortControls.tsx`: Sorting dropdown with multiple options
- **UI Components**: Extensive shadcn/ui component library
  - Cards, Buttons, Forms, Sheets (drawers), Input fields, Date pickers, Sliders, Checkboxes, Popovers

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
✅ **PostgreSQL database persistence** (liked events stored per-session)
✅ **Netlify serverless functions** for database API
✅ localStorage fallback when database unavailable
✅ Dark theme
✅ **Real live events from Ticketmaster API**
✅ **Prices displayed in South African Rands (ZAR)**
✅ **Currency conversion (USD to ZAR) with accurate exchange rate (17.32)**
✅ **Comprehensive filtering** (by category, price, date, location radius, popularity)
✅ **Smart search** with autocomplete suggestions
✅ **Advanced sorting** (by date, price, popularity, distance)
✅ **Event categories** (music, nightclub, bar, restaurant, sports, comedy, theater, festival)
✅ **Realistic venue pricing** based on category and ratings
✅ Loading states for API calls
✅ Fallback to mock data if API fails
✅ Responsive design

## Future Enhancements (Not Implemented)
- User authentication and profiles
- Real-time event updates
- Social sharing
- Event check-ins
- User reviews and ratings
- Push notifications
- Map integration for venue locations
- Ticket purchasing integration
