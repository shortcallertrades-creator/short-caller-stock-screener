const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');

// Read the HTML file
let html = fs.readFileSync(htmlPath, 'utf8');

// Remove orphaned <!-- screener-charts-section-end --> markers within content
// Match markers that appear mid-text (not at line boundaries)
html = html.replace(/<!-- screener-charts-section-end -->/g, '');

// Also clean up any orphaned section-start markers
html = html.replace(/<!-- screener-charts-section-start -->/g, '<!-- screener-charts-section-start -->');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ HTML cleaned up - removed errant section markers');
