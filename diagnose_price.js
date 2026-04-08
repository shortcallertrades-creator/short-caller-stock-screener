const https = require('https');
const cheerio = require('cheerio');

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
        console.log(`\nHTML length: ${data.length} bytes\n`);
        
        // Log first occurrence of "quote" or "price" related content
        const quoteMatches = data.match(/quote[^}]{0,200}/gi);
        if (quoteMatches) {
          console.log('Found "quote" patterns:');
          quoteMatches.slice(0, 5).forEach(m => console.log('  ' + m.substring(0, 100)));
        }
        
        // Look for price patterns  
        const pricePatterns = [
          /class="[^"]*price[^"]*"[^>]*>([^<]+)</gi,
          /\$\s*(\d+\.?\d*)/g,
          /<td[^>]*>[\s]*(\d+\.?\d*)/g,
          /quote-price[^>]*>([^<]+)</gi,
          /"last":\s*(\d+\.?\d*)/g
        ];
        
        console.log('\nSearching for prices:');
        pricePatterns.forEach((pattern, i) => {
          const matches = [...data.matchAll(pattern)];
          if (matches.length > 0) {
            console.log(`  Pattern ${i}: Found ${matches.length} matches`);
            matches.slice(0, 3).forEach(m => {
              console.log(`    - ${m[0].substring(0, 80)}`);
            });
          }
        });
        
        // Look for specific AAPL price context
        const aapl = data.match(/AAPL[^}]{0,500}/i);
        if (aapl) {
          console.log('\nContext around AAPL:');
          console.log(aapl[0].substring(0, 300));
        }
        
        // Check for JSON data
        const jsonMatch = data.match(/window\.data\s*=\s*({[^;]+});/);
        if (jsonMatch) {
          console.log('\nFound window.data JSON');
          try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed.data && parsed.data[0]) {
              console.log('First data item:', JSON.stringify(parsed.data[0]).substring(0, 200));
            }
          } catch (e) {
            console.log('Could not parse JSON:', e.message);
          }
        }
        
        resolve();
      });
    }).on('error', reject);
  });
}

fetchAndAnalyze().catch(console.error);
