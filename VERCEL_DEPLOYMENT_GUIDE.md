# Vercel Deployment Guide for HuntFlow AI Frontend

This guide will walk you through deploying your Vite + React frontend application to Vercel.

## Prerequisites

1. **GitHub/GitLab/Bitbucket Account**: Your code should be in a Git repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **Node.js**: Ensure your project builds successfully locally

---

## Step-by-Step Deployment Instructions

### Step 1: Prepare Your Code

#### 1.1 Ensure Your Code is Committed to Git

```bash
# Check git status
git status

# If you have uncommitted changes, commit them
git add .
git commit -m "Prepare for Vercel deployment"
```

#### 1.2 Push to Remote Repository

```bash
# If you haven't pushed yet, push to your remote repository
git push origin main
# or
git push origin master
```

---

### Step 2: Create Vercel Account and Connect Repository

#### 2.1 Sign Up/Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Sign up using GitHub, GitLab, or Bitbucket (recommended for easy integration)

#### 2.2 Import Your Project

1. Once logged in, click **"Add New..."** → **"Project"**
2. Import your Git repository:
   - If connected via GitHub/GitLab/Bitbucket, select your repository
   - Or paste your repository URL
3. Click **"Import"**

---

### Step 3: Configure Project Settings

#### 3.1 Framework Preset

Vercel should automatically detect **Vite** as your framework. If not:
- **Framework Preset**: Select **"Vite"** or **"Other"**
- **Root Directory**: Leave as `./` (or set if your frontend is in a subdirectory)
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (Vite's default output)

#### 3.2 Environment Variables

**IMPORTANT**: Add your environment variables before deploying:

1. In the project settings, go to **"Environment Variables"**
2. Add the following variables:

   | Variable Name | Value | Description |
   |--------------|-------|-------------|
   | `GEMINI_API_KEY` | Your Gemini API key | Required for AI features. Get from [Google AI Studio](https://makersuite.google.com/app/apikey) |
   | `VITE_API_URL` | Your backend API URL | e.g., `https://your-backend.vercel.app/api` or your production backend URL |

   **Note**: 
   - For Vite, environment variables must be prefixed with `VITE_` to be exposed to the client
   - The `GEMINI_API_KEY` is already configured in `vite.config.ts` to work without the prefix
   - The `VITE_API_URL` is now used in `services/api.ts` (updated for production)
   - Make sure to set these for **Production**, **Preview**, and **Development** environments
   - **Example values**:
     - Development: `VITE_API_URL=http://localhost:8000/api`
     - Production: `VITE_API_URL=https://your-backend-api.com/api`

3. Click **"Save"** after adding each variable

---

### Step 4: Deploy

1. Click **"Deploy"** button
2. Vercel will:
   - Install dependencies (`npm install`)
   - Run build command (`npm run build`)
   - Deploy the `dist` folder
3. Wait for the deployment to complete (usually 1-3 minutes)

---

### Step 5: Verify Deployment

1. Once deployment completes, you'll see a success message
2. Click on the deployment URL (e.g., `your-project.vercel.app`)
3. Test your application:
   - Check if the app loads correctly
   - Test AI features (they should work with your Gemini API key)
   - Verify API calls work (if backend is deployed)

---

## Post-Deployment Configuration

### Custom Domain (Optional)

1. Go to your project settings → **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificates

### Environment Variables Updates

If you need to update environment variables:
1. Go to **Settings** → **Environment Variables**
2. Edit or add new variables
3. Redeploy your project (or wait for automatic redeploy on next push)

---

## Continuous Deployment

Vercel automatically deploys on every push to your main branch:

1. **Automatic Deployments**: Every push to `main`/`master` triggers a production deployment
2. **Preview Deployments**: Pull requests get preview URLs automatically
3. **Manual Deployments**: You can also trigger deployments manually from the dashboard

---

## Troubleshooting

### Build Fails

**Error**: Build command fails
- **Solution**: Test build locally first: `npm run build`
- Check for TypeScript errors: `npx tsc --noEmit`
- Ensure all dependencies are in `package.json`

**Error**: Environment variables not found
- **Solution**: Make sure variables are set in Vercel dashboard
- For Vite, use `VITE_` prefix for client-side variables
- Redeploy after adding variables

### Runtime Errors

**Error**: API calls fail (CORS or 404)
- **Solution**: 
  - Update `VITE_API_URL` in environment variables
  - Ensure backend CORS allows your Vercel domain
  - Check browser console for specific errors

**Error**: Gemini API not working
- **Solution**: 
  - Verify `GEMINI_API_KEY` is set correctly
  - Check API key permissions and quotas
  - Review browser console for API errors

### Performance Issues

- Enable Vercel Analytics in project settings
- Check bundle size: `npm run build` and review output
- Consider code splitting if bundle is large

---

## Important Notes

1. **Backend API**: The API URL has been updated to use environment variables. Make sure to:
   - Deploy your backend separately (or use Vercel serverless functions)
   - Set the `VITE_API_URL` environment variable in Vercel with your production backend URL
   - The code now uses `import.meta.env.VITE_API_URL` with fallback to localhost for development

2. **Environment Variables**: 
   - Never commit `.env` files with sensitive keys
   - Always use Vercel's environment variables for production
   - The `.gitignore` already excludes `.env` files

3. **Build Output**: 
   - Vite outputs to `dist/` folder
   - Vercel automatically serves this folder
   - No additional configuration needed

---

## Quick Reference Commands

```bash
# Test build locally
npm run build

# Preview production build locally
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Install dependencies
npm install
```

---

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Deployment Guide**: [vitejs.dev/guide/static-deploy.html](https://vitejs.dev/guide/static-deploy.html)
- **Vercel Support**: Available in your Vercel dashboard

---

## Next Steps

After successful deployment:
1. ✅ Test all features in production
2. ✅ Set up custom domain (optional)
3. ✅ Configure monitoring/analytics
4. ✅ Set up backend API (if not already deployed)
5. ✅ Update API URLs in environment variables

---

**Congratulations!** Your frontend is now live on Vercel! 🚀

