# 📋 COPY & PASTE DEPLOYMENT COMMANDS

## ⚠️ IMPORTANT
Replace these before pasting:
- `shortcallertrades` = your GitHub username
- `shortcallertrades@gmail.com` = your GitHub email

---

## COMMAND SET 1: GITHUB SETUP
### 👉 RUN THIS IN POWERSHELL (Copy all at once)

```powershell
cd "c:\Users\Dell\New folder"
git config user.name "shortcallertrades"
git config user.email "shortcallertrades@gmail.com"
git branch -M main
git remote add origin https://github.com/shortcallertrades/short-caller-stock-screener.git
git add .
git commit -m "Deploy to Vercel - Stock screener with TikTok integration ready"
git push -u origin main
```

---

## WHAT HAPPENS AFTER YOU RUN THIS:

1. **Git configures** with your credentials
2. **All files staged** for commit
3. **Code committed** with message
4. **Pushed to GitHub** → appears at GitHub.com

---

## NEXT STEPS (In this order):

### STEP 1: Create GitHub Repository
👉 **Open in Browser:** https://github.com/new

Fill in:
- **Repository name**: `short-caller-stock-screener`
- **Description**: Stock screener with TikTok integration
- **Visibility**: Public
- **Click**: "Create repository"

### STEP 2: Run Git Push Command
👉 **Copy command above** and paste into PowerShell

Watch for output like:
```
Enumerating objects: ...
Counting objects: ...
Compressing objects: ...
Writing objects: ...
✓ Branch 'main' set to track remote branch 'main' from 'origin'
```

### STEP 3: Deploy to Vercel
👉 **Open in Browser:** https://vercel.com/new

1. Click "Continue with GitHub" → Authorize if needed
2. Click "Import Git Repository"
3. Search: `short-caller-stock-screener`
4. Click "Import"
5. Click "Deploy" (settings auto-detected)
6. Wait 2-3 minutes... ✓ LIVE!

### STEP 4 (OPTIONAL): Add TikTok Token
👉 **See**: [GET_TIKTOK_TOKEN.md](GET_TIKTOK_TOKEN.md) for token instructions

Then:
- Go to: https://vercel.com/dashboard
- Settings → Environment Variables
- Add: `TIKTOK_ACCESS_TOKEN=your_token_here`
- Redeploy

---

## 📊 FULL CHECKLIST

- ☐ **Step 1**: Create GitHub repo at https://github.com/new
- ☐ **Step 2**: Paste git push command into PowerShell
- ☐ **Step 3**: Deploy to Vercel at https://vercel.com/new
- ☐ **Step 4** (Optional): Add TikTok token to Vercel
- ☐ **Verify**: Visit your new URL in browser

---

## 🆘 IF SOMETHING GOES WRONG

### Git says "fatal: remote origin already exists"
```powershell
git remote remove origin
# Then run the full command set again
```

### Can't push to GitHub
```powershell
git remote -v  # Shows current remotes
# Copy the URL from error and verify it matches your repo
```

### Vercel can't find your repository
- Make sure you ran git push successfully
- Wait a few minutes and try again
- Check that repo appears at https://github.com/shortcallertrades/short-caller-stock-screener

---

## ✅ YOU'RE ALL SET!

Everything is ready. Just:
1. Create GitHub repo
2. Paste the command above
3. Deploy to Vercel

**Total time**: ~10 minutes! 🚀

---

## 🔗 LINKS TO HAVE OPEN

| Step | Link |
|------|------|
| 1 | https://github.com/new |
| 2 | PowerShell (your terminal) |
| 3 | https://vercel.com/new |
| 4 | https://developer.tiktok.com (if adding token) |
| 5 | https://vercel.com/dashboard (to verify) |

---

Ready! Follow the checklist above! ✨
