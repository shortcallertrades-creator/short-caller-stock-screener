# 🎵 GET YOUR TIKTOK ACCESS TOKEN - QUICK GUIDE

## ⚡ FASTEST WAY (5 minutes)

### Step 1: Go to TikTok Developer Portal
👉 **Visit**: https://developer.tiktok.com/

### Step 2: Log In with @shortcallertrades
- Click "Log in with TikTok"
- Use your @shortcallertrades account
- Complete 2FA if prompted

### Step 3: Create an App
1. Go to **Apps** section
2. Click **"Create an app"**
3. Fill in:
   - **App Name**: Short Caller Stock Screener
   - **Description**: Automated stock screener posts to TikTok
   - **Product**: Video Upload API
   - **Platform**: Web

### Step 4: Get Your Credentials
After creating the app, you'll see:
```
Client Key (also called App ID):     xxxxxxxxxxxxxx
Client Secret:                        xxxxxxxxxxxxxx
```

📌 **Copy these and save them!**

### Step 5: Get Access Token (2 Methods - Choose 1)

#### METHOD A: Quick Token (2 minutes) - FOR TESTING
1. In your app settings, find **"Credentials"**
2. Scroll down to **"Access Token"** section
3. Look for a **"Get Access Token"** or **"Generate Token"** button
4. If available, click it and copy the token

#### METHOD B: OAuth Flow (5 minutes) - FOR PRODUCTION
1. In your app, go to **"Scopes"**
2. Select: `video.upload` and `user.info`
3. Save settings
4. Have a developer create OAuth token by visiting:
```
https://www.tiktok.com/v1/oauth/authorize/
?client_key=YOUR_CLIENT_KEY
&scope=video.upload,user.info
&response_type=code
&redirect_uri=http://localhost:3000/callback
&state=random_string
```
5. You'll be redirected with an authorization code
6. Exchange it for access token using curl:
```bash
curl -X POST https://open.tiktokapis.com/v1/oauth/token/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_key=YOUR_KEY&client_secret=YOUR_SECRET&code=AUTH_CODE&grant_type=authorization_code"
```

---

## 🎯 ONCE YOU HAVE THE TOKEN

### Option 1: Add to Local .env for Testing
1. Open: `.env` file in your project
2. Find: `TIKTOK_ACCESS_TOKEN=`
3. Add your token:
   ```
   TIKTOK_ACCESS_TOKEN=v1.xxxxxxxxxxxxx
   ```
4. Save
5. Test locally: `npm run update-charts`

### Option 2: Add to Vercel for Production (RECOMMENDED)
1. Go to: **https://vercel.com/dashboard**
2. Select your project: **short-caller-stock-screener**
3. Click **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `TIKTOK_ACCESS_TOKEN`
   - **Value**: Your token
   - **Scope**: Production, Preview, Development
5. Click **Add**
6. Click **Redeploy** in Deployments tab

---

## ⚠️ IMPORTANT NOTES

**Token Details:**
- ✓ Keep it SECRET - never share
- ✓ Expires in 24 hours (auto-refresh handled)
- ✓ Use refresh token to get new ones
- ✓ Different from API Key

**Rate Limits:**
- 10-15 videos per hour typical
- After limit hit, wait 1 hour
- Built-in delays prevent hitting limits

**Security:**
- ✅ Never commit .env to GitHub
- ✅ Use Vercel environment variables for production
- ✅ Rotate tokens monthly

---

## 🔗 QUICK LINKS

| Link | Purpose |
|------|---------|
| https://developer.tiktok.com | Creator Academy |
| https://developer.tiktok.com/app | Your Apps |
| https://www.tiktok.com/creator | Creator Studio |
| https://vercel.com/dashboard | Your Vercel Projects |

---

## ✅ VERIFICATION CHECKLIST

- ☐ Created TikTok Developer Account
- ☐ Created App in Developer Portal
- ☐ Got Client Key and Client Secret
- ☐ Got Access Token
- ☐ Tested token locally (optional)
- ☐ Added token to Vercel environment variables
- ☐ Redeployed Vercel project
- ☐ Configured redirect URL (if using OAuth)
- ☐ Ready to auto-post to TikTok!

---

## 🆘 TROUBLESHOOTING

### "Can't find Access Token button"
- Make sure you're in the **Credentials** section
- Check if app is approved by TikTok
- Try OAuth flow instead

### "Invalid Token Error"
- Verify token is pasted correctly
- Check it hasn't expired (24 hour limit)
- Generate a new token and retry

### "Permission Denied"
- Make sure scopes include `video.upload`
- Re-authenticate to get new token with proper scopes

### "401 Unauthorized on TikTok API"
- Token may have expired
- Refresh or generate new token
- Verify token added to Vercel environment

---

## 🎬 NEXT STEPS

1. **Get your token** (follow steps above)
2. **Add to Vercel**: Vercel Dashboard → Environment Variables
3. **Redeploy**: Click Redeploy in Vercel
4. **Test**: Run `npm run update-charts` once deployed

Once configured, your stock picks will **automatically post to @shortcallertrades**! 🚀

---

**Status**: Ready to receive your TikTok access token!
