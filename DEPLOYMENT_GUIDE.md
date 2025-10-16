# Deployment Guide

## ✅ What's Been Fixed

### 1. Ticketmaster API Integration
- ✅ Ticketmaster API key is now configured and working
- ✅ App is fetching real events from South Africa
- ✅ Vite config updated to pass API key to frontend

### 2. Database Connection
- ✅ Production database connected (DATABASE_URL and NETLIFY_DATABASE_URL)
- ✅ Database schema pushed to production
- ✅ Tables created: `liked_events` and `user_preferences`
- ✅ Netlify serverless functions configured for database operations

### 3. Netlify Deployment Fix
- ✅ Updated pnpm lockfile (pnpm-lock.yaml)
- ✅ Removed npm lockfile to avoid conflicts
- ✅ Updated netlify.toml to use `pnpm run build`
- ✅ Build configuration is now correct

## 🚀 Deploy to Netlify

### Required Environment Variables
Before deploying, add these environment variables in your Netlify project settings:

1. **VITE_TICKETMASTER_API_KEY** - Your Ticketmaster API key
2. **DATABASE_URL** - Your PostgreSQL database connection string
3. **NETLIFY_DATABASE_URL** - Same as DATABASE_URL (or separate if needed)

### Deploy Steps
1. Push your changes to your Git repository
2. Connect your repository to Netlify (if not already connected)
3. Add the environment variables in Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add all three variables listed above
4. Deploy!

### Build Settings (Already Configured)
- Build command: `pnpm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

## 📝 Notes
- The pnpm lockfile is now up to date
- All dependencies are properly installed
- Database schema is deployed to production
- Serverless functions are ready for production use

## 🐛 Known Development Issue
In local development, the `/api/liked-events` endpoint shows an error because Netlify functions need to be run locally. To test locally with full functionality:
```bash
pnpm run dev:netlify
```

This will run both Vite and Netlify Dev server together.
