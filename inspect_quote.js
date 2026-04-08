const https = require('https');
https.get('https://finviz.com/quote.ashx?t=KRRO', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const start = html.indexOf('Analyst Rating');
    console.log('ANALYST START INDEX:', start);
    console.log(html.slice(start, start + 2000));
  });
}).on('error', console.error);
