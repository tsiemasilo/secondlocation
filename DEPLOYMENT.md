# Deploying to Netlify

This guide will help you deploy your event discovery app to Netlify.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com))
2. Your Ticketmaster API key

## Deployment Steps

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize your site:
   ```bash
   netlify init
   ```

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Git (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket

2. Go to [app.netlify.com](https://app.netlify.com)

3. Click "Add new site" → "Import an existing project"

4. Connect your Git provider and select your repository

5. Configure build settings (should auto-detect from netlify.toml):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

6. Click "Deploy site"

## Environment Variables

After deployment, you need to add your environment variables:

1. Go to your site settings in Netlify

2. Navigate to "Environment variables" section

3. Add the following variable:
   - **Key:** `VITE_TICKETMASTER_API_KEY`
   - **Value:** Your Ticketmaster API key

4. Trigger a redeploy for the changes to take effect

## Getting a Ticketmaster API Key

1. Go to [developer.ticketmaster.com](https://developer.ticketmaster.com)
2. Sign up for a free account
3. Create an app to get your API key
4. Add the key to Netlify's environment variables

## Troubleshooting

### Build Fails
- Check that all dependencies are installed
- Verify Node.js version is 20 or higher
- Check build logs in Netlify dashboard

### API Key Not Working
- Ensure the key is named exactly `VITE_TICKETMASTER_API_KEY`
- Redeploy after adding environment variables
- Check that your API key is valid and has the correct permissions

### Routing Issues
- The `_redirects` file in the `public` folder handles SPA routing
- All routes redirect to `index.html` for client-side routing

## Files Created for Deployment

- `netlify.toml` - Netlify configuration
- `public/_redirects` - SPA routing configuration
- `.env.example` - Example environment variables
- `DEPLOYMENT.md` - This deployment guide

## Custom Domain

To add a custom domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Continuous Deployment

Once connected to Git, Netlify will automatically:
- Deploy when you push to your main branch
- Create preview deployments for pull requests
- Run builds with your configured settings
