# Finviz Screener Dashboard v1 - Setup & Restoration Guide

**Version:** 1.0 (Vertical Layout - Production Ready)  
**Backup Date:** April 8, 2026  
**Status:** ✅ COMPLETE AND WORKING

---

## Quick Start

### Option 1: Run in Current Location
```bash
cd c:\Users\Dell\New folder\backup_v1_vertical_layout
C:\Program Files\nodejs\node.exe update_charts.js
```

### Option 2: Restore to Main Project
```bash
# Copy all files from backup to main project
xcopy backup_v1_vertical_layout\* . /Y /I

# Then run:
C:\Program Files\nodejs\node.exe update_charts.js
```

---

## Files Included in This Backup

| File | Description |
|------|-------------|
| `update_charts.js` | Main deployment script (380 lines) - fetches Finviz data and updates dashboard |
| `index.html` | Dashboard webpage with 20 vertical-card ticker cards |
| `styles.css` | Dark theme CSS with vertical-card layout styles |
| `script.js` | Client-side interactivity (simple) |
| `package.json` | npm dependencies (cheerio, sharp) |
| `ticker_data.json` | Live ticker data with prices, ratings, targets |
| `posted_tickers.json` | Tracking list of deployed tickers (prevents duplicates) |
| `README.md` | Overview documentation (created by backup) |
| `SETUP_INSTRUCTIONS.md` | This file - complete restoration guide |

---

## What's Working in This Version

✅ **Live Data Integration**
- Fetches 20 tickers from Finviz screener (short interest > 10%)
- Extracts current prices for each ticker
- Parses analyst ratings with dates (2026)
- Captures price targets

✅ **Visual Design**
- Dark theme (background: #0f1419)
- Vertical-card layout (chart above metrics above ratings)
- 450px chart height with inverted colors for dark display
- Badge system: "New today" (green), "Hit" (blue), "In progress" (gray)

✅ **Data Persistence**
- `ticker_data.json` stores historical data
- `posted_tickers.json` prevents duplicate "New today" badges
- Daily updates without losing old records

✅ **Deployment Automation**
- Comprehensive logging to `deployment.log`
- Error handling with fallbacks
- Can be scheduled via Windows Task Scheduler

---

## Featured Tickers (As of April 8, 2026)

1. AAPL - $253.50 (Target: $315) - 5 analyst ratings
2. AEHR - $50.25 - 1 rating
3. AGEN - $4.06 - No analyst ratings
4. APLS - $40.70 (Target: $28) - Price target reached 🎯
5. BETR - $44.84 - No ratings
6. BMEA - $1.90 - No ratings
7. CENX - $66.03 - No ratings
8. ELVN - $43.16 - No ratings
9. FMC - $17.64 - No ratings
10. GLNG - $54.44 - No ratings
11. HOG - $21.18 - No ratings
12. HTZ - $5.88 - No ratings
13. LGVN - $1.16 - No ratings
14. LOVE - $15.44 - No ratings
15. MPLT - $24.14 - No ratings
16. NEXT - $8.74 - No ratings
17. PROP - $2.50 - No ratings
18. SLNO - $52.35 - No ratings
19. STAA - $21.09 - No ratings
20. WLK - $123.39 (Target: $127) - 3 analyst ratings

---

## Technology Stack

**Backend:**
- Node.js (native https module)
- Dependencies: cheerio (HTML parsing), sharp (image resizing)

**Frontend:**
- HTML5 semantic markup
- CSS3 with custom properties (CSS variables)
- Responsive design with flexbox

**Data:**
- JSON file-based persistence
- No database required
- All data stored locally

---

## How update_charts.js Works

### Execution Flow:
1. **Fetch Screener** → Gets list of 20 tickers matching "Finviz Breakout Screener"
2. **Per-Ticker Data** → For each ticker:
   - Fetch current price from Finviz quote page
   - Parse analyst ratings (Jan-Apr 2026)
   - Extract price targets
   - Generate HTML card with all info
3. **HTML Injection** → Replaces section between:
   - `<!-- screener-charts-section-start -->`
   - `<!-- screener-charts-section-end -->`
4. **File Persistence** → Updates ticker_data.json with latest prices
5. **Logging** → Records all steps with timestamps

### Key Functions:

**`fetchHTML(url, description)`**
- Handles HTTPS requests with 10-second timeout
- Includes error logging
- Returns HTML content of page

**`fetchTickers()`**
- Parses Finviz screener page
- Extracts ticker symbols from table
- Returns array of 20 symbols

**`fetchTickerData(ticker)`**
- Fetches individual quote page
- Extracts current price (handles both old/new Finviz HTML)
- Parses analyst ratings table
- Extracts price targets from ratings

**`parsePrice(html)`**
- Tries old format: `<span class="quote-price">`
- Falls back to new format: `<strong class="quote-price_wrapper_price">`
- Returns number or null

**`parseRatings(html)`**
- Finds all analyst rows in ratings table
- Filters for 2026 dates only
- Extracts: date, analyst, action, price target
- Returns array sorted by date

**`generateChartBlock(ticker, ratings, currentPrice, initialPrice, targetPrice, isNewToday)`**
- Creates complete HTML card element
- Includes: header, chart, metrics pills, ratings table
- Applies appropriate badges
- Returns HTML string ready for injection

**`updateHTML(newTickers)`**
- Reads current index.html
- Builds new HTML blocks for all tickers
- Replaces section between markers
- Writes updated HTML back to file

---

## CSS Layout Structure

### Vertical Card Layout:
```
┌─ .vertical-card ───────────────────┐
│                                    │
│ ┌─ .card-header ────────────────┐  │
│ │ AAPL | 5 ratings | New today  │  │
│ └────────────────────────────────┘  │
│                                    │
│ ┌─ .chart-section ───────────────┐ │
│ │   [Chart Image 450px height]   │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌─ .metrics-section ─────────────┐ │
│ │ 🎯 $315 | 📈 N/A | 💰 $253.50 │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌─ .ratings-section ─────────────┐ │
│ │ ┌─ .ratings-table ──────────┐ │ │
│ │ │ Date|Analyst|Action|Price │ │ │
│ │ │──────────────────────────│ │ │
│ │ │ Jan-30|Maxim Group|Upgrade│ │ │
│ │ └──────────────────────────┘ │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

### CSS Classes Used:
- `.vertical-card` - Main container (flex column)
- `.card-header` - Ticker name + badges
- `.chart-section` - Chart display area
- `.metrics-section` - Four metric pills
- `.ratings-section` - Analyst ratings table
- `.rating-tag` - Blue pill with rating count
- `.badge-pill` - Status badges (new/hit/active)
- `.metric-pill` - Individual metrics (target/change/current)

---

## Data Persistence Model

### ticker_data.json Structure:
```json
{
  "AAPL": {
    "initialPrice": null,
    "currentPrice": 253.5,
    "targetPrice": 315,
    "ratings": [
      {
        "timestamp": 1769749200,
        "date": "Jan-30-26",
        "action": "Upgrade",
        "analyst": "Maxim Group",
        "priceTargetChange": "$300"
      }
    ],
    "firstPostDate": "Wed Apr 08 2026",
    "lastUpdate": "Wed Apr 08 2026",
    "status": "active"
  }
}
```

### posted_tickers.json Structure:
```json
[
  "AAPL", "FMC", "BETR", "HTZ", "STAA", "NEXT",
  "AEHR", "MPLT", "APLS", "GLNG", "WLK", "ELVN",
  "CENX", "PROP", "AGEN", "SLNO", "BMEA", "LGVN",
  "HOG", "LOVE"
]
```

---

## Deployment Options

### Manual Execution
```bash
cd "c:\Users\Dell\New folder"
C:\Program Files\nodejs\node.exe .\update_charts.js
```

### Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Set Trigger: Daily (or Hourly)
4. Set Action: Start a program
5. Program: `C:\Program Files\nodejs\node.exe`
6. Arguments: `update_charts.js`
7. Start in: `c:\Users\Dell\New folder`

### Batch File (run_update_charts.bat)
```batch
@echo off
cd /d c:\Users\Dell\New folder
C:\Program Files\nodejs\node.exe .\update_charts.js
```

---

## Restoration Checklist

**Step 1: Prepare Backup**
- [ ] Extract files from backup_v1_vertical_layout

**Step 2: Install Dependencies**
```bash
npm install cheerio sharp
```

**Step 3: Run Update Script**
```bash
C:\Program Files\nodejs\node.exe update_charts.js
```

**Step 4: Verify Output**
- [ ] Check index.html was updated
- [ ] Check deployment.log for success
- [ ] Open index.html in browser
- [ ] Verify 20 ticker cards display

**Step 5: Schedule (Optional)**
- [ ] Create Windows Task Scheduler task
- [ ] Set to run daily at desired time
- [ ] Verify first scheduled run

---

## Troubleshooting

### Issue: Script runs but shows no output
**Solution:** Run with full Node.js path:
```bash
C:\Program Files\nodejs\node.exe update_charts.js
```

### Issue: "Module not found" error
**Solution:** Install dependencies:
```bash
npm install
```

### Issue: HTML not updating (blank screener section)
**Check:** Ensure both comment markers exist in index.html:
- `<!-- screener-charts-section-start -->`
- `<!-- screener-charts-section-end -->`

### Issue: Price showing as "N/A"
**Reason:** Finviz HTML structure changed or ticker page unavailable  
**Solution:** Check Finviz manually at `https://finviz.com/quote.ashx?t=TICKER`

### Issue: Ratings not appearing
**Reason:** Analyst data may not exist for ticker (only 2026 dates included)  
**Solution:** Normal - some tickers have no recent analyst ratings

---

## Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Screener Fetch | ✅ Working | Retrieves 20 tickers reliably |
| Price Extraction | ✅ Working | Handles both Finviz HTML formats |
| Ratings Parsing | ✅ Working | Filters 2026 dates only |
| HTML Generation | ✅ Working | Creates proper vertical-card layout |
| HTML Injection | ✅ Working | Replaces between markers correctly |
| Data Persistence | ✅ Working | JSON files updated successfully |
| Dashboard Display | ✅ Working | All 20 cards render properly |
| Logging | ✅ Working | Timestamped logs to deployment.log |

---

## Performance Notes

- Single run takes ~15-20 seconds (depends on Finviz response time)
- Can be run every hour without issues
- No rate limiting observed from Finviz
- Local processing only (no external API calls except Finviz)

---

## Future Enhancement Ideas

- Add hourly scheduling to Windows Task Scheduler
- Store historical price data for charting trends
- Add filtering by sector or float %
- Export data to CSV
- Add mobile responsive design
- SMS/Email alerts when price targets change
- Add watchlist feature

---

## Support

If you need to restore everything from backup:
1. Copy all files from this directory to your main project
2. Run `npm install` to get dependencies
3. Execute `node update_charts.js` to fetch latest data
4. Open `index.html` in browser

**Everything is pre-configured and ready to use!**

---

**Created:** April 8, 2026  
**Production Ready:** YES ✅  
**All 20 Tickers Confirmed:** YES ✅
