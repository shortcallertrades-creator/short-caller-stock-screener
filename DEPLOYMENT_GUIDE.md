# Deployment Guide - Making Your Site Public

## 🚀 Quick Start: Deploy to Vercel (Free)

Vercel is the easiest way to deploy your Node.js site publicly with automatic HTTPS.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Log in to Vercel

```bash
vercel login
```

This opens a browser. Sign in or create a free account at https://vercel.com

### Step 3: Deploy Your Site

```bash
cd "c:\Users\Dell\New folder"
vercel
```

When prompted:
- **Scope**: Choose your account or create new
- **Project name**: `short-caller-stock-screener`
- **Directory**: Press Enter (current directory)
- **Override settings**: No

**Your site is now live!** 🎉

You'll get a URL like: `https://short-caller-stock-screener.vercel.app`

### Step 4: Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: `short-caller-stock-screener`
3. Go to **Settings → Environment Variables**
4. Add:
   - **Name**: `TIKTOK_ACCESS_TOKEN`
   - **Value**: Your TikTok access token
   - **Environments**: Production, Preview, Development
5. Click **Add**
6. **Redeploy** (Settings → Deployments → Redeploy)

---

## 📱 Update TikTok OAuth Configuration

After getting your public URL, update your TikTok app settings:

### Step 1: Get Your Public URL

From Vercel deployment (e.g., `https://short-caller-stock-screener.vercel.app`)

### Step 2: Update TikTok Developer Dashboard

1. Go to https://developer.tiktok.com/app
2. Select your app
3. Go to **Basic Information**
4. Update **Redirect URLs**:
   ```
   https://short-caller-stock-screener.vercel.app/tiktok-callback
   ```
5. Save changes

### Step 3: Update Your Local .env File

```bash
PUBLIC_URL=https://short-caller-stock-screener.vercel.app
TIKTOK_ACCESS_TOKEN=your_token_here
```

### Step 4: Re-deploy to Vercel

```bash
vercel --prod
```

---

## 🔄 Automated Daily Updates

### Option A: Vercel Cron Jobs (Recommended)

Create `vercel.json` cron configuration:

```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ],
  "crons": [
    {
      "path": "/api/daily-update",
      "schedule": "0 9,12,15,18 * * *"
    }
  ]
}
```

Then add the endpoint in `server.js`:

```javascript
// Automated daily update endpoint
app.get('/api/daily-update', async (req, res) => {
  console.log('Running scheduled update...');
  const { exec } = require('child_process');
  exec('node update_charts.js', (err, stdout, stderr) => {
    if (err) {
      console.error('Update failed:', err);
      return res.status(500).json({ error: 'Update failed' });
    }
    console.log(stdout);
    res.json({ success: true, message: 'Update completed' });
  });
});
```

### Option B: External Cron Service

For free scheduled tasks on Vercel:

1. Use https://cron-job.org (free tier)
2. Create a new cron job
3. URL: `https://your-vercel-url.vercel.app/api/daily-update`
4. Schedule: Daily at 9 AM, 12 PM, 3 PM, 6 PM

---

## 🎯 Full Deployment Checklist

- [ ] Have TikTok access token ready
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Deploy: `vercel`
- [ ] Copy your Vercel URL
- [ ] Update TikTok app redirect URL
- [ ] Set TIKTOK_ACCESS_TOKEN in Vercel environment
- [ ] Redeploy: `vercel --prod`
- [ ] Test: Visit your Vercel URL
- [ ] Set up scheduled updates (cron job)
- [ ] Monitor logs in Vercel dashboard

---

## 🔗 Useful Links

| Action | URL |
|--------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| TikTok Developer | https://developer.tiktok.com |
| Your Site | Will be shown after deployment |
| Cron-Job.org | https://cron-job.org |

---

## 📊 Verify Your Deployment

After deploying to Vercel:

1. **Visit your site**: `https://short-caller-stock-screener.vercel.app`
   - Should show 20 stock cards
   - Live prices visible

2. **Check API endpoints**:
   - Health: `/api/health`
   - Tickers: `/api/tickers`
   - Posted: `/api/posted`

3. **Monitor logs**:
   - Go to Vercel Dashboard
   - Select your project
   - View **Deployments → Logs**

---

## 🚨 Troubleshooting

### "MODULE NOT FOUND: dotenv"
```bash
npm install
npm run build
vercel --prod
```

### "TIKTOK_ACCESS_TOKEN not defined"
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify `TIKTOK_ACCESS_TOKEN` is set
3. Redeploy project

### "404 Page Not Found"
- Ensure `index.html` is in root directory
- Check that files are committed to Git
- Redeploy: `vercel --prod`

---

## 📈 Next Steps After Deployment

1. **Test TikTok Integration**:
   ```bash
   npm run update-charts
   ```
   Should post to @shortcallertrades automatically

2. **Set Up Scheduled Updates**:
   - Use Cron-Job.org (free)
   - Or add Vercel cron jobs config

3. **Monitor Performance**:
   - Check Vercel Analytics
   - Review TikTok posting logs

---

## 💾 Backup & Version Control

Always keep your code safe:

```bash
# Initialize Git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial deployment to Vercel"

# Push to GitHub (optional but recommended)
git push origin main
```

---

**Status**: 🎉 Your site is public and ready for TikTok integration!

**Questions?** Check `TIKTOK_SETUP.md` for TikTok-specific help.
