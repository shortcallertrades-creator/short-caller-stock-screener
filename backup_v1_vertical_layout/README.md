# Finviz Screener Dashboard - Backup v1 (Vertical Layout)

**Backup Date:** April 8, 2026
**Version:** 1.0 - Vertical Layout Release

## Overview

This is a complete backup of the working Finviz Screener Dashboard with vertical card layout. All files are saved and ready to restore if needed.

## What's Included

### Core Files
- **update_charts.js** - Node.js deployment script that:
  - Fetches tickers from your Finviz breakout screener
  - Retrieves live pricing and analyst ratings from Finviz
  - Generates vertical ticker cards with charts
  - Updates index.html automatically
  - Includes comprehensive logging

- **index.html** - Dashboard webpage with:
  - Dark theme styling (dark background, light text)
  - Header with title and features section
  - Live screener feed section (auto-populated by update_charts.js)
  - Vertical card layout for each ticker
  - Footer

- **styles.css** - Complete dark theme styling with:
  - CSS variables for theme colors
  - Vertical card layout styles (.vertical-card)
  - Badge system (new, hit, active)
  - Metric pills and ratings table styling
  - Responsive design

- **package.json** - Project dependencies and npm scripts:
  - Dependencies: cheerio (HTML parsing), sharp (image editing)
  - Scripts: `npm run update-charts` to run deployment

- **ticker_data.json** - Persistent ticker data storage with:
  - Current prices for all tracked tickers
  - Analyst ratings and price targets
  - First post date and last update timestamp

## Layout Features

### Vertical Card Design
Each ticker displays as a vertical stack with:
1. **Header** - Ticker symbol + rating count + status badge
2. **Chart** - Finviz daily chart (450px height)
3. **Metrics** - Target price, current price, % change, status
4. **Ratings Table** - Analyst recommendations with dates and targets

### Status Badges
- **New today** (Green) - First time ticker appears in screener
- **Hit** (Blue) - Current price ≥ target price (price target reached)
- **In progress** (Gray) - Tracking toward target

## Running the Script

### One-time Run
```bash
cd "c:\Users\Dell\New folder"
C:\Program Files\nodejs\node.exe .\update_charts.js
```

### Scheduled (Hourly) Updates
Use Windows Task Scheduler with the batch file: `run_update_charts.bat`

### npm Method (requires PATH setup)
```bash
npm run update-charts
```

## Screener URL

The script fetches from your breakout screener:
```
https://finviz.com/screener.ashx?v=211&f=sh_short_o10,ta_highlow50d_nh&ft=3&o=high52w
```

This URL searches for stocks with:
- Short float > 10%
- 50-day high/low near breakout levels

## File Structure

```
backup_v1_vertical_layout/
├── update_charts.js          (Deployment script)
├── index.html                (Dashboard webpage)
├── styles.css                (CSS styling)
├── package.json              (Dependencies)
├── ticker_data.json          (Live ticker data)
├── README.md                 (This file)
└── BACKUP_INFO.txt           (Backup metadata)
```

## Restoration Instructions

1. Copy all files from this backup folder to your project root
2. Run: `npm install` (to reinstall dependencies if needed)
3. Execute: `C:\Program Files\nodejs\node.exe .\update_charts.js`
4. Open `index.html` in your browser to view the dashboard

## Key Implementation Details

### Vertical Layout CSS
- `.vertical-card` - Main container with flex column layout
- `.card-header` - Ticker name and badges
- `.chart-section` - 450px height chart container
- `.metrics-section` - Price metrics display
- `.ratings-section` - Analyst ratings table

### Data Persistence
- `ticker_data.json` stores all ticker metadata
- `posted_tickers.json` tracks which tickers have been posted
- Daily updates refresh prices and ratings without losing history

### Deployment Logic
- First run: Creates chart blocks for all existing tickers
- Subsequent runs: Updates prices/ratings for all tickers
- Only new tickers from screener are marked as "New today"
- Historical data is preserved between deployments

## Current Status

✅ **Working Features:**
- Live Finviz data fetching
- Vertical card layout rendering
- Dark theme styling
- Analyst ratings display
- Price tracking
- Status badge system

## Deployment Information

**Last Deployment:** Wed Apr 08 2026, 11:54 UTC
**Total Tickers:** 20
**Sample Data:**
- AAPL: $253.50 (Target: $315)
- WLK: $123.39 (Target: $127 - Close to hitting target!)
- Multiple tickers tracking analyst targets

## Next Steps

To continue using this dashboard:
1. Run the script hourly via Windows Task Scheduler
2. Monitor the deployment.log for any errors
3. Charts are saved locally in the `charts/` folder for performance
4. Analyst ratings update daily from live Finviz data

## Notes

- All prices are live from Finviz as of last deployment
- Analyst ratings are filtered for 2026 only
- Empty rating targets show "—" or "N/A"
- Network timeouts are set to 10 seconds per request
- Original Finviz charts are used as fallback if local editing fails

---

**Backup Created:** April 8, 2026
**Status:** Production Ready ✅
