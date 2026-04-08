const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');

// Read the HTML file
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace the entire screener section with a clean slate
const sectionPattern = /(<!-- screener-charts-section-start -->)[\s\S]*(<!-- screener-charts-section-end -->)/;
const cleanSection = `<!-- screener-charts-section-start -->
      <section class="section">
        <h2>Stock Charts from Screener</h2>
        <p>Live screener feed updated hourly</p>
        <div class="screener-grid" id="screener-charts">
          <!-- Charts will be populated here -->
        </div>
      </section>
      <!-- screener-charts-section-end -->`;

if (sectionPattern.test(html)) {
  html = html.replace(sectionPattern, cleanSection);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✓ HTML section reset to clean state');
} else {
  console.log('⚠ Section markers not found in expected format');
}
