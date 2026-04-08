$html = @'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Finviz Screener Dashboard</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header">
      <div class="container">
        <h1>Finviz Screener Dashboard</h1>
        <p class="tagline">Live split-view chart cards with a dark theme and analyst ratings.</p>
        <a class="cta-button" href="#screener-charts">View Screener Feed</a>
      </div>
    </header>

    <main class="container">
      <section id="features" class="section">
        <h2>Features</h2>
        <div class="cards">
          <article class="card">
            <h3>Live Screener Feed</h3>
            <p>Automatic Finviz screener results rendered as split layout cards for every ticker.</p>
          </article>
          <article class="card">
            <h3>Dark Dashboard</h3>
            <p>A modern dark theme optimized for financial chart presentation.</p>
          </article>
          <article class="card">
            <h3>Chart Annotations</h3>
            <p>Price markers, target levels, and rating summaries are shown on the chart cards.</p>
          </article>
        </div>
      </section>

      <section class="section section-alt">
        <h2>Dashboard Split Layout</h2>
        <p>This split panel layout puts the chart on the left and the analysis details on the right.</p>
        <div class="split-card single-split-card">
          <div class="split-chart">
            <div class="chart-frame">
              <img src="https://finviz.com/chart.ashx?t=AAPL&ty=c&ta=1&p=d&s=l" alt="AAPL chart" />
            </div>
          </div>
          <div class="split-panel">
            <div class="panel-header">
              <h3>AAPL</h3>
              <span class="rating-tag">2 ratings</span>
            </div>
            <div class="chart-info vertical">
              <div class="metric-pill target-pill">🎯 Target: <span>$220</span></div>
              <div class="metric-pill change-pill">📈 Change: <span>+3.2%</span></div>
              <div class="metric-pill current-pill">💰 Current: <span>$210</span></div>
            </div>
            <div class="ratings-wrap split-ratings">
              <table class="ratings-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Analyst</th>
                    <th>Action</th>
                    <th>Price Target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Apr 01</td>
                    <td>Goldman Sachs</td>
                    <td>Maintain</td>
                    <td>+5%</td>
                  </tr>
                  <tr>
                    <td>Mar 24</td>
                    <td>Morgan Stanley</td>
                    <td>Upgrade</td>
                    <td>+12%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- screener-charts-section-start -->
      <section class="section">
        <h2>Stock Charts from Screener</h2>
        <p>Live screener chart posts will appear below once the script updates the feed.</p>
        <div class="screener-grid" id="screener-charts">
          <div class="empty-state">
            <p>Waiting for screener updates...</p>
          </div>
        </div>
      </section>
      <!-- screener-charts-section-end -->
    </main>

    <footer class="site-footer">
      <p>&copy; 2026 Finviz Screener Dashboard.</p>
    </footer>

    <script src="script.js"></script>
  </body>
</html>
'@
Set-Content -Path 'c:\Users\Dell\New folder\index.html' -Value $html -Encoding utf8
