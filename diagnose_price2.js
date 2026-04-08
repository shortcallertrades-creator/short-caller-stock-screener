const https = require('https');

async function fetchAndAnalyze() {
  return new Promise((resolve, reject) => {
    console.log('Fetching AAPL from Finviz...');
    https.get('https://finviz.com/quote.ashx?t=AAPL', {
      headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'},
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Find the quote-price section and show surrounding HTML
        const regex = /<[^>]*quote-price[^>]*>[\s\S]{0,500}<\/[^>]*>/gi;
        let match;
        let count = 0;
        
        while ((match = regex.exec(data)) && count < 3) {
          console.log(`\n=== MATCH ${++count} ===`);
          console.log(match[0].substring(0, 400));
          console.log('...');
        }
        
        // Also look for any visible text/price numbers
        const numberRegex = />\s*(\d{2,4}\.\d{2})\s*</g;
        console.log('\n\n=== Price-like numbers ===');
        let numMatch;
        let numCount = 0;
        while ((numMatch = numberRegex.exec(data)) && numCount < 5) {
          console.log(`  $${numMatch[1]}`);
          numCount++;
        }
        
        // Look for numeric content after quote-price
        const numberAfterQuotePrice = data.match(/class="quote-price"[^<]*>[\s\S]{0,200}(\d+\.?\d*)/);
        if (numberAfterQuotePrice) {
          console.log('\n\n=== Quote price content ===');
          console.log(numberAfterQuotePrice[0]);
        }
        
        resolve();
      });
    }).on('error', reject);
  });
}

fetchAndAnalyze().catch(console.error);
