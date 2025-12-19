# Quick Start: Deploy to Vercel

## 🚀 Fast Track (5 minutes)

### 1. Push Code to Git
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New..."** → **"Project"**
3. Import your repository
4. **Add Environment Variables**:
   - `GEMINI_API_KEY` = Your Gemini API key
   - `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.com/api`)
5. Click **"Deploy"**

### 3. Done! 🎉
Your app will be live at `your-project.vercel.app`

---

## 📋 Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Get from [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `VITE_API_URL` | Backend API endpoint | `https://your-backend.com/api` |

---

## ⚙️ Configuration Files Created

- ✅ `vercel.json` - Vercel configuration (auto-detected, but included for clarity)
- ✅ `services/api.ts` - Updated to use environment variables

---

## 🔍 Troubleshooting

**Build fails?**
- Run `npm run build` locally first to check for errors

**API not working?**
- Check `VITE_API_URL` is set correctly in Vercel
- Ensure backend CORS allows your Vercel domain

**Gemini API errors?**
- Verify `GEMINI_API_KEY` is correct
- Check API quotas/limits

---

For detailed instructions, see [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

