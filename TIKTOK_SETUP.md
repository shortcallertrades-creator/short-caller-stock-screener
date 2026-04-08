# TikTok Integration Setup Guide

## Overview

The TikTok integration will automatically post your stock picks to your TikTok channel (@shortcallertrades) whenever new tickers are discovered by the screener.

**Current Capabilities:**
- ✅ Auto-generates captions with ticker, price, target, and analyst ratings
- ✅ Tracks posted tickers to prevent duplicates
- ✅ Handles rate limiting gracefully
- ✅ Full logging of all posts

**Coming Soon:**
- 🎥 Video generation with chart overlays (requires FFmpeg or Remotion)
- 📊 More advanced visual formatting
- 🔔 Engagement metrics tracking

---

## Getting TikTok API Credentials

### Step 1: Create a TikTok Developer Account

1. Go to [TikTok Developer Platform](https://developer.tiktok.com/)
2. Click "Start Building" or "Sign Up"
3. Choose "Log in with TikTok" or create a new account
4. You'll need an active TikTok account (@shortcallertrades)
5. Complete the sign-up form with:
   - Email address
   - Developer company/name
   - App name (e.g., "Short Caller Stock Screener")
   - App description

### Step 2: Create an Application

1. After sign-up, go to your [Developer Dashboard](https://developer.tiktok.com/app)
2. Click "Create an app"
3. Select "Web" as the platform
4. Choose product: **Video Upload API** or **Social Media Platform**
5. Fill in app details:
   - **App name:** Short Caller Stock Screener
   - **App description:** Automated screener posting stock ideas to TikTok
   - **Redirect URL:** `http://localhost:3000/callback` (for testing)

### Step 3: Get Your OAuth Credentials

After app creation, you'll see:
- **Client Key** (also called App ID or Client ID)
- **Client Secret**

⚠️ **IMPORTANT:** Save these securely. You'll need them.

### Step 4: Get Your Access Token

There are two ways to get an access token:

#### Option A: OAuth Flow (Recommended for Production)

1. In your app settings, enable "User Level Access":
   - Go to **Permissions** 
   - Request scopes: `video.upload`, `user.info`
   
2. Build OAuth login URL:
```
https://www.tiktok.com/v1/oauth/authorize/
?client_key={YOUR_CLIENT_KEY}
&scope=video.upload,user.info
&response_type=code
&redirect_uri=http://localhost:3000/callback
&state=random_state_string
```

3. User visits this URL and authorizes
4. They're redirected back with authorization code
5. Exchange code for access token (server-side):
```bash
curl -X POST https://open.tiktokapis.com/v1/oauth/token/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_key=YOUR_CLIENT_KEY&client_secret=YOUR_CLIENT_SECRET&code=AUTH_CODE&grant_type=authorization_code"
```

Response includes `access_token` (valid 24 hours) and `refresh_token`

#### Option B: Use TikTok Creator Studio (Easier)

If you just want to test:

1. Go to [TikTok Creator Studio](https://www.tiktok.com/creator)
2. Connect your account
3. You can manually post content while we set up API

Then come back to API setup later.

### Step 5: Add Access Token to Configuration

1. Copy your access token
2. Create `.env` file in project root:
```bash
# Windows PowerShell:
@"
TIKTOK_ACCESS_TOKEN=your_token_here_paste_it_here
"@ | Out-File -Encoding utf8 .env

# Or manually edit .env file (copy from .env.example and fill in)
```

3. **IMPORTANT:** Add `.env` to `.gitignore` so you never commit credentials:
```
node_modules/
.env
.env.local
posting_tiktoks.json
tiktok_poster.log
```

---

## Complete Setup Checklist

- [ ] Create TikTok Developer Account
- [ ] Create Developer App
- [ ] Get Client Key and Client Secret
- [ ] Obtain Access Token (via OAuth or Creator Studio)
- [ ] Create `.env` file in project root
- [ ] Add `TIKTOK_ACCESS_TOKEN=your_token_here` to `.env`
- [ ] Add `.env` to `.gitignore`
- [ ] Test by running: `node update_charts.js`

---

## Testing Your Setup

### Test 1: Verify Token Works

```bash
# Run the update script
C:\Program Files\nodejs\node.exe .\update_charts.js
```

Look for output:
```
📱 Starting TikTok posting...
========== TikTok Posting Started ==========
✅ Successfully posted [TICKER] to TikTok
========== TikTok Posting Completed ==========
```

### Test 2: Check Generated Posts

Before token is set up, the script will log posts to a JSON file:
```bash
# View what would be posted:
cat tiktok_posts_2026-04-08.json
```

### Test 3: Monitor Logs

```bash
# Follow TikTok posting logs:
tail -f tiktok_poster.log
```

---

## Troubleshooting

### "TIKTOK_ACCESS_TOKEN not configured"

**Problem:** Token not found in environment
**Solution:** 
1. Create `.env` file with token
2. Ensure file is in project root directory
3. No spaces around `=` sign: `TOKEN_NAME=value`

### "Rate limited on TikTok API"

**Problem:** Too many posts in short time
**Solution:**
- Built-in 2-second delay between posts
- TikTok has limits (typically 10-15 videos per hour)
- Check TikTok Developer documentation for exact limits

### "401 Unauthorized"

**Problem:** Invalid or expired token
**Solution:**
1. Refresh token if using OAuth
2. Go to Creator Studio and re-authenticate
3. Get new access token

### "Permission denied"

**Problem:** App doesn't have video.upload scope
**Solution:**
1. Go to TikTok Developer Dashboard
2. Check app Permissions
3. Request `video.upload` scope
4. Re-authenticate to get new token with scope

---

## API Rates and Limits

| Limit | Value | Notes |
|-------|-------|-------|
| Posts per hour | 10-15 | Varies by account tier |
| Request rate | 10 req/sec | TikTok API limit |
| Token lifetime | 24 hours | Refresh token valid 1 year |
| Video length | 3-10 min | Standard TikTok limits |
| File size | 287.6 MB | Max upload size |

---

## Token Refresh

Tokens expire after 24 hours. To refresh:

```javascript
// This is handled automatically in future updates
const refreshTokenUrl = 'https://open.tiktokapis.com/v1/oauth/token/';

// POST with:
{
  client_key: YOUR_CLIENT_KEY,
  client_secret: YOUR_CLIENT_SECRET,
  refresh_token: YOUR_REFRESH_TOKEN,
  grant_type: 'refresh_token'
}
```

---

## Video Format Recommendations

For best TikTok engagement:

**Duration:** 15-60 seconds
**Format:** MP4, H.264 codec, 16:9 aspect ratio
**Text Overlay:** 
- Ticker: Large (24-32pt)
- Price: Medium (16-20pt)
- Target: Medium (16-20pt)
- Analysts: Small (12-16pt)

**Content Ideas:**
- Show stock + live price
- Analyst upgrades/targets
- Comparison to previous price
- Short squeeze metrics

---

## Manual Posting Fallback

If API isn't working, you can manually post prepared content:

```bash
# View prepared content:
cat tiktok_posts_*.json

# Copy caption and post manually via https://www.tiktok.com/upload
```

Files are created daily: `tiktok_posts_YYYY-MM-DD.json`

---

## Environment Variables Reference

```bash
# Production
TIKTOK_ACCESS_TOKEN=your_live_token

# Optional: For video updates instead of new posts
TIKTOK_VIDEO_ID=your_video_id

# Debug mode (add this line to tiktok_poster.js)
DEBUG=true
```

---

## Security Best Practices

1. ✅ **Never commit `.env` file** - add to `.gitignore`
2. ✅ **Rotate tokens regularly** - do every month
3. ✅ **Use separate app for testing** - don't mix prod/dev
4. ✅ **Monitor API usage** - check TikTok Developer Dashboard
5. ✅ **Log access attempts** - we do this automatically
6. ✅ **Revoke old tokens** - clean up unused tokens

---

## Next Steps

1. **Complete setup above**
2. **Run test deployment:** `node update_charts.js`
3. **Check TikTok channel** - look for your first auto-post!
4. **Monitor logs** - `tiktok_poster.log` for troubleshooting

---

## Support Resources

- [TikTok Developer Portal](https://developer.tiktok.com/)
- [TikTok Creator Studio](https://www.tiktok.com/creator)
- [OAuth Documentation](https://developers.tiktok.com/doc/login-kit-web/)
- [Video Upload API Docs](https://developers.tiktok.com/doc/video-upload-api)

---

**Version:** 1.0  
**Last Updated:** April 8, 2026  
**Status:** Ready for Testing
