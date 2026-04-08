const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const https = require('https');
const cheerio = require('cheerio');

// Create a log file
const logPath = path.join(__dirname, 'deployment.log');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

function log(...args) {
  const msg = args.join(' ');
  console.log(msg);
  logStream.write(msg + '\n');
}

log(`\n[${new Date().toISOString()}] DEPLOYMENT START`);

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const screenerUrl = 'https://finviz.com/screener.ashx?v=211&f=sh_short_o10,ta_highlow50d_nh&ft=3&o=high52w';
const postedFile = path.join(__dirname, 'posted_tickers.json');
const tickerDataFile = path.join(__dirname, 'ticker_data.json');

log(`Posted file path: ${postedFile}`);
log(`Ticker data file path: ${tickerDataFile}`);
log(`Screener URL: ${screenerUrl}`);

function loadPosted() {
  try {
    log('Loading posted tickers...');
    const data = fs.readFileSync(postedFile, 'utf8');
    const posted = new Set(JSON.parse(data));
    log(`Loaded ${posted.size} previously posted tickers`);
    return posted;
  } catch (error) {
    log('No posted tickers file found, starting fresh');
    return new Set();
  }
}

function savePosted(posted) {
  try {
    console.log(`Saving ${posted.size} posted tickers to file...`);
    fs.writeFileSync(postedFile, JSON.stringify([...posted], null, 2));
    console.log('Posted tickers saved successfully');
  } catch (error) {
    console.error(`ERROR: Failed to save posted tickers: ${error.message}`);
  }
}

function loadTickerData() {
  try {
    console.log('Loading ticker data from file...');
    const data = fs.readFileSync(tickerDataFile, 'utf8');
    const tickerData = JSON.parse(data);
    console.log(`Loaded data for ${Object.keys(tickerData).length} tickers`);
    return tickerData;
  } catch (error) {
    console.log('No ticker data file found, starting fresh');
    return {};
  }
}

function saveTickerData(data) {
  try {
    console.log(`Saving ticker data for ${Object.keys(data).length} tickers...`);
    fs.writeFileSync(tickerDataFile, JSON.stringify(data, null, 2));
    console.log('Ticker data saved successfully');
  } catch (error) {
    console.error(`ERROR: Failed to save ticker data: ${error.message}`);
  }
}

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    console.log(`  Fetching: ${url}`);
    https.get(url, {
      headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'},
      timeout: 10000
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        res.resume();
        return;
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`  ✓ Fetched ${data.length} bytes`);
        resolve(data);
      });
    }).on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    }).on('timeout', function() {
      this.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    console.log(`  Fetching image: ${url}`);
    https.get(url, {
      headers: {'User-Agent': 'Mozilla/5.0'},
      timeout: 10000
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        res.resume();
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        console.log(`  ✓ Fetched image (${buffer.length} bytes)`);
        resolve(buffer);
      });
    }).on('error', (error) => {
      reject(new Error(`Image error: ${error.message}`));
    });
  });
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}-${day}-${year}`;
}

function formatPercent(initialPrice, currentPrice) {
  if (!initialPrice || !currentPrice) return null;
  return (currentPrice - initialPrice) / initialPrice * 100;
}

function buildStatusLabel(initialPrice, currentPrice, targetPrice) {
  if (!currentPrice) return 'Tracking';
  if (targetPrice && currentPrice >= targetPrice) return 'Price target reached';
  const percent = formatPercent(initialPrice, currentPrice);
  return percent !== null ? `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}% gain` : 'Tracking';
}

function parsePrice(html) {
  try {
    // Try new HTML structure: <strong class="quote-price_wrapper_price">253.50</strong>
    let priceRegex = /<strong[^>]*class="[^"]*quote-price_wrapper_price[^"]*"[^>]*>([^<]+)<\/strong>/i;
    let match = html.match(priceRegex);
    
    // Fallback to old structure if new one not found
    if (!match) {
      priceRegex = /<span[^>]*class="[^"]*quote-price[^"]*"[^>]*>([^<]+)<\/span>/i;
      match = html.match(priceRegex);
    }
    
    if (match) {
      const price = parseFloat(match[1].replace(/[^0-9.-]/g, ''));
      if (!isNaN(price) && price > 0) {
        console.log(`    → Price: $${price.toFixed(2)}`);
        return price;
      }
    }
    console.log('    → No price found');
    return null;
  } catch (error) {
    console.error(`    → Error parsing price: ${error.message}`);
    return null;
  }
}

function parseRatings(html) {
  try {
    const ratings = [];
    const regex = /\{\s*"dateTimestamp":(\d+),"eventType":"chartEvent\/ratings","ratings":(\[.*?\])\s*\}/gs;
    for (const match of html.matchAll(regex)) {
      try {
        const timestamp = Number(match[1]);
        const items = JSON.parse(match[2]);
        if (new Date(timestamp * 1000).getFullYear() !== 2026) continue;
        for (const item of items) {
          ratings.push({
            timestamp,
            date: formatDate(timestamp),
            action: item.action || 'Unknown',
            analyst: item.analyst || 'Unknown',
            priceTargetChange: item.targetPrice || '—'
          });
        }
      } catch (e) {
        console.log(`    → Rating parse error: ${e.message}`);
      }
    }
    console.log(`    → Found ${ratings.length} analyst ratings`);
    return ratings.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error(`    → Error: ${error.message}`);
    return [];
  }
}

async function fetchTickers() {
  try {
    log('Fetching tickers from screener...');
    const html = await fetchHTML(screenerUrl);
    log('Screener HTML fetched, parsing tickers...');
    const matches = [...html.matchAll(/quote\.ashx\?t=([A-Z]{1,5})/g)];
    log(`Found ${matches.length} ticker matches`);
    const tickers = [...new Set(matches.map(match => match[1]))];
    log(`✓ Found ${tickers.length} unique tickers: ${tickers.slice(0, 5).join(', ')}${tickers.length > 5 ? '...' : ''}`);
    return tickers;
  } catch (error) {
    log(`ERROR fetching tickers: ${error.message}`);
    log(`  Stack: ${error.stack}`);
    return [];
  }
}

async function fetchTickerData(ticker) {
  try {
    console.log(`Fetching ${ticker}...`);
    const html = await fetchHTML(`https://finviz.com/quote.ashx?t=${ticker}`);
    const ratings = parseRatings(html);
    const currentPrice = parsePrice(html);
    const targetPrices = ratings.map(r => r.priceTargetChange).filter(p => p !== '—' && p.startsWith('$')).map(p => parseFloat(p.replace(/[$,]/g, ''))).filter(p => !isNaN(p) && p > 0);
    const targetPrice = targetPrices.length > 0 ? Math.max(...targetPrices) : null;
    console.log(`  ✓ ${ticker}: $${currentPrice ? currentPrice.toFixed(2) : 'N/A'} target=$${targetPrice ? targetPrice.toFixed(2) : 'N/A'}`);
    return { ratings, currentPrice, targetPrice };
  } catch (error) {
    console.error(`ERROR for ${ticker}: ${error.message}`);
    return { ratings: [], currentPrice: null, targetPrice: null };
  }
}

function createTextSvg(text, color = 'red') {
  return Buffer.from(`<svg width="300" height="40"><text x="0" y="25" font-size="18" fill="${color}" font-family="Arial">${text}</text></svg>`);
}

async function generateChartBlock(ticker, ratings, currentPrice, initialPrice, targetPrice, isNewToday) {
  try {
    if (!fs.existsSync('charts')) fs.mkdirSync('charts');
    console.log(`Generating chart for ${ticker}...`);

    const gainPercent = formatPercent(initialPrice, currentPrice);
    const changeText = gainPercent !== null ? `${gainPercent > 0 ? '+' : ''}${gainPercent.toFixed(2)}%` : 'N/A';
    const statusText = buildStatusLabel(initialPrice, currentPrice, targetPrice);
    const badgeLabel = isNewToday ? 'New today' : targetPrice && currentPrice >= targetPrice ? 'Hit' : 'In progress';
    const badgeClass = isNewToday ? 'new' : targetPrice && currentPrice >= targetPrice ? 'hit' : 'active';

    let chartUsed = `https://finviz.com/chart.ashx?t=${ticker}&ty=c&ta=1&p=d&s=l`;

    try {
      await delay(2000);
      const imgBuffer = await fetchImage(chartUsed);
      await sharp(imgBuffer).png().toFile(`charts/${ticker}.png`);
      chartUsed = `charts/${ticker}.png`;
      console.log(`  ✓ Chart saved`);
    } catch (e) {
      console.log(`  Warning: Using original chart`);
    }

    const rows = ratings.length > 0
      ? ratings.map((r) => `<tr><td>${r.date}</td><td>${r.analyst}</td><td>${r.action}</td><td>${r.priceTargetChange}</td></tr>`).join('')
      : `<tr><td colspan="4" class="no-ratings">No ratings found</td></tr>`;

    return `<div class="vertical-card">
              <div class="card-header">
                <h3>${ticker}</h3>
                <div class="panel-labels">
                  <span class="rating-tag">${ratings.length} rating${ratings.length === 1 ? '' : 's'}</span>
                  <span class="badge-pill ${badgeClass}">${badgeLabel}</span>
                </div>
              </div>
              <div class="chart-section">
                <div class="chart-frame">
                  <img src="${chartUsed}" alt="${ticker}" />
                </div>
              </div>
              <div class="metrics-section">
                <div class="metric-pill target-pill">🎯 Target: <span>$${targetPrice ? targetPrice.toFixed(2) : 'N/A'}</span></div>
                <div class="metric-pill change-pill">📈 Change: <span>${changeText}</span></div>
                <div class="metric-pill current-pill">💰 Current: <span>$${currentPrice ? currentPrice.toFixed(2) : 'N/A'}</span></div>
                <div class="metric-pill status-pill">${statusText}</div>
              </div>
              <div class="ratings-section">
                <table class="ratings-table">
                  <thead><tr><th>Date</th><th>Analyst</th><th>Action</th><th>Price Target</th></tr></thead>
                  <tbody>${rows}</tbody>
                </table>
              </div>
            </div>`;
  } catch (error) {
    console.error(`ERROR generating chart for ${ticker}: ${error.message}`);
    return '';
  }
}

async function updateHTML(newTickers) {
  try {
    console.log('\nUpdating HTML...');
    const htmlPath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    const today = new Date().toDateString();
    const tickerData = loadTickerData();

    console.log(`Processing ${newTickers.length} new tickers...`);
    for (const ticker of newTickers) {
      if (!tickerData[ticker]) {
        const { ratings, currentPrice, targetPrice } = await fetchTickerData(ticker);
        tickerData[ticker] = {
          initialPrice: currentPrice,
          currentPrice,
          targetPrice,
          ratings,
          firstPostDate: today,
          lastUpdate: today,
          status: targetPrice && currentPrice >= targetPrice ? 'hit' : 'active'
        };
      }
    }

    const allTickers = Object.keys(tickerData).sort();
    console.log(`Updating all ${allTickers.length} tickers...`);

    for (const ticker of allTickers) {
      const { ratings, currentPrice, targetPrice } = await fetchTickerData(ticker);
      if (currentPrice) tickerData[ticker].currentPrice = currentPrice;
      if (targetPrice) tickerData[ticker].targetPrice = targetPrice;
      if (ratings.length) tickerData[ticker].ratings = ratings;
      tickerData[ticker].lastUpdate = today;
      if (!tickerData[ticker].firstPostDate) tickerData[ticker].firstPostDate = today;
    }

    console.log(`Generating ${allTickers.length} chart blocks...`);
    const chartBlocks = (await Promise.all(allTickers.map(async ticker => {
      const { ratings, initialPrice, targetPrice, currentPrice, firstPostDate } = tickerData[ticker];
      return await generateChartBlock(ticker, ratings, currentPrice || initialPrice, initialPrice, targetPrice, firstPostDate === today);
    }))).join('');

    const sectionPattern = /(<!-- screener-charts-section-start -->)[\s\S]*?(<!-- screener-charts-section-end -->)/;
    const replacement = `$1
      <section class="section">
        <h2>Stock Charts from Screener</h2>
        <p>Live screener feed updated hourly</p>
        <div class="screener-grid" id="screener-charts">
          ${chartBlocks}
        </div>
      </section>
      $2`;

    html = html.replace(sectionPattern, replacement);
    const htmlEnd = html.indexOf('</html>');
    if (htmlEnd !== -1) html = html.substring(0, htmlEnd + 7);

    fs.writeFileSync(htmlPath, html, 'utf8');
    saveTickerData(tickerData);
    console.log(`✓✓✓ SUCCESS: ${allTickers.length} tickers deployed ✓✓✓\n`);
  } catch (error) {
    console.error(`ERROR updating HTML: ${error.message}`);
    throw error;
  }
}

(async () => {
  try {
    log('\n=== DEPLOYMENT START ===\n');
    const posted = loadPosted();
    const currentTickers = await fetchTickers();
    const newTickers = currentTickers.filter(t => !posted.has(t));
    const tickerData = loadTickerData();

    if (newTickers.length > 0 || Object.keys(tickerData).length > 0) {
      await updateHTML(newTickers);
      if (newTickers.length > 0) {
        newTickers.forEach(t => posted.add(t));
        savePosted(posted);
      }
    } else {
      log('No tickers found\n');
    }
    log(`\n[${new Date().toISOString()}] DEPLOYMENT COMPLETE\n`);
  } catch (error) {
    log(`FATAL: ${error.message}`);
    log(`Stack: ${error.stack}`);
  }
  
  // Close the log stream and exit
  logStream.end(() => {
    process.exit(0);
  });
})().catch(err => {
  console.error('Unhandled error:', err);
  logStream.end(() => {
    process.exit(1);
  });
});
