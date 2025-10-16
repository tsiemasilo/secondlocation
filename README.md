# Event Discovery App

A modern event discovery platform built with React, TypeScript, and Vite. Features a Tinder-style swipe interface to explore events from Ticketmaster API.

## Features

- 🎭 Swipe-based event discovery interface
- 📅 Browse events by date and location
- ❤️ Save favorite events
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🌙 Dark mode support
- 📱 Responsive design

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (shadcn/ui)
- **Routing:** React Router v6
- **API:** Ticketmaster Discovery API

## Development

### Prerequisites

- Node.js 20 or higher
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file and add your Ticketmaster API key:

```env
VITE_TICKETMASTER_API_KEY=your_api_key_here
```

Get your API key from [developer.ticketmaster.com](https://developer.ticketmaster.com)

### Running Locally

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Deployment

This app is ready to deploy to Netlify. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Click the button above or push to GitHub
2. Connect your repository
3. Add `VITE_TICKETMASTER_API_KEY` environment variable
4. Deploy!

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── types/         # TypeScript types
├── public/            # Static assets
├── netlify.toml       # Netlify configuration
└── DEPLOYMENT.md      # Deployment guide
```

## License

MIT
