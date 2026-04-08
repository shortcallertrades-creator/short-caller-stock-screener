# QUICK DEPLOYMENT GUIDE - SHORT CALLER STOCK SCREENER

## 📋 Quick Summary
Your site is **100% ready to deploy**. Just 3 steps to go live:

1. Create Vercel account
2. Connect Git repository  
3. Vercel auto-deploys

---

## STEP 1: Create Vercel Account (2 minutes)

1. Go to: **https://vercel.com**
2. Click "Sign Up"
3. Choose: **"Continue with GitHub"** (easiest option)
   - Create GitHub account if you don't have one
   - Authorize Vercel to access GitHub
4. **Done!** You now have a Vercel account

---

## STEP 2: Set Up Git Repository (5 minutes)

Your code needs to be on GitHub for Vercel to deploy it.

### Option A: Using GitHub Desktop (Easiest)

1. Download: **https://desktop.github.com**
2. Sign in with your GitHub account
3. Click **File → Add Local Repository**
4. Browse to: `c:\Users\Dell\New folder`
5. Click **Create Repository**
6. Fill in:
   - **Name**: short-caller-stock-screener
   - **Description**: Stock screener with TikTok integration
   - **Do not initialize** (files already exist)
7. Click **Create Repository**
8. In GitHub Desktop:
   - Type in "Summary": **Initial commit**
   - Click **Commit to main**
   - Click **Push to origin** (or Publish if first time)

### Option B: Using Command Line

```bash
cd "c:\Users\Dell\New folder"
git init
git add .
git commit -m "Initial commit - Stock screener with TikTok integration"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/short-caller-stock-screener.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

---

## STEP 3: Deploy on Vercel (2 minutes)

1. Go to: **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for: **short-caller-stock-screener**
5. Click **Import**
6. **All settings are auto-detected** ✓
   - Framework: Auto-detect
   - Build command: (leave blank)
   - Output: (leave blank)
7. Click **"Deploy"**

**⏳ Wait 2-3 minutes...**

✨ **Your site is now LIVE!**

You'll see a message like:
```
✓ Production deployment ready at:
  https://short-caller-stock-screener.vercel.app
```

---

## STEP 4: Add TikTok API Token (5 minutes)

1. Get your **TikTok Access Token**:
   - Visit: https://developer.tiktok.com
   - Create app
   - Get access token

2. **Add to Vercel Environment**:
   - Go to: **https://vercel.com/dashboard**
   - Click your project: **short-caller-stock-screener**
   - **Settings** → **Environment Variables**
   - Click **"Add New"**
   - **Name**: `TIKTOK_ACCESS_TOKEN`
   - **Value**: (paste your token)
   - Choose: Production, Preview, Development
   - Click **Save**

3. **Redeploy** (to use the token):
   - Go to **Deployments** tab
   - Click the three dots `...` next to the latest deployment
   - Click **Redeploy**
   - Wait for green checkmark

---

## STEP 5: Configure TikTok Redirect URL

Now that you have your public Vercel URL:

1. Go to: **https://developer.tiktok.com**
2. Select your app
3. **Settings** → **Basic Information**  
4. Update **Redirect URLs**:
   ```
   https://short-caller-stock-screener.vercel.app/tiktok-callback
   ```
5. **Save**

---

## Test Your Deployment

### Verify Site is Live
```
Visit: https://short-caller-stock-screener.vercel.app
```

Should show:
- ✅ "Short Caller Stock Ideas" header
- ✅ 20 stock cards with live prices
- ✅ Analyst ratings and targets
- ✅ Dark theme

### Test API Endpoints
In your browser, visit:
- `https://short-caller-stock-screener.vercel.app/api/health`
  - Should show: `{"status":"ok"}`
- `https://short-caller-stock-screener.vercel.app/api/tickers`
  - Should show your 20 tickers

### Test TikTok Integration
```bash
cd "c:\Users\Dell\New folder"
npm run update-charts
```

Watch for output:
```
📱 Starting TikTok posting...
========== TikTok Posting Started ==========
✅ Successfully posted [TICKER] to TikTok
```

---

## 🎉 You're Done!

Your site is now:
- ✅ **Live on Vercel** at `https://short-caller-stock-screener.vercel.app`
- ✅ **Auto-deploys** when you push code to GitHub
- ✅ **Ready for TikTok integration** with token configured
- ✅ **Globally accessible** - anyone can visit your screener

---

## Local Testing (Optional)

To test locally before deploying:

```bash
cd "c:\Users\Dell\New folder"
npm start
```

Then visit: `http://localhost:3000`

---

## Troubleshooting

### "Error: Failed to deploy"
- Check that all files are committed to GitHub
- Ensure no large binary files (use `.gitignore`)
- Try redeploying from Vercel dashboard

### "TikTok token not working"
- Verify token is in Vercel Environment Variables (not just .env)
- Click **Redeploy** in Vercel after adding token
- Check `tiktok_poster.log` for error details

### "Site shows 404"
- Wait 5 minutes for initial build to complete
- Check Vercel Deployments tab for build logs
- Verify `index.html` and `server.js` are in repository

### "Can't push to GitHub"
- Verify you're signed into GitHub Desktop
- Check repository name matches
- Try: `git remote -v` to verify connection

---

## Next Steps

After deployment is live:

1. **Set up daily updates** (optional):
   - Use https://cron-job.org to trigger `npm run update-charts` daily
   - Or use Vercel's cron jobs feature

2. **Share your site**:
   - Share URL with friends
   - Post on social media
   - Link from TikTok bio: `https://short-caller-stock-screener.vercel.app`

3. **Monitor performance**:
   - Check Vercel Analytics dashboard
   - Review TikTok posting logs

---

## Files Created for Deployment

Your project includes:

- ✅ `server.js` - Express server for Vercel
- ✅ `vercel.json` - Vercel configuration
- ✅ `package.json` - Dependencies configured
- ✅ `.env.example` - Template for environment variables
- ✅ `.gitignore` - Prevents committing secrets

---

**Status**: Ready for deployment! Follow the 5 steps above and you're live in 10 minutes! 🚀

Questions? Check [TIKTOK_SETUP.md](TIKTOK_SETUP.md) for TikTok-specific help.
