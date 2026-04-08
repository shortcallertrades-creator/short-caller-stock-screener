const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, '.'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
  }
}));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// TikTok OAuth callback endpoint
app.get('/tiktok-callback', (req, res) => {
  const { code, state } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  // Log the authorization code (for debugging)
  console.log('TikTok authorization code received:', code.substring(0, 10) + '...');
  
  // In production, exchange this code for an access token server-side
  // For now, save it for manual processing
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] TikTok Auth Code: ${code}\n`;
  fs.appendFileSync(path.join(__dirname, 'tiktok_auth.log'), logEntry);

  res.json({
    success: true,
    message: 'Authorization code received. Check server logs.',
    code: code.substring(0, 20) + '...' // Return partial code for confirmation
  });
});

// API endpoint to get ticker data
app.get('/api/tickers', (req, res) => {
  try {
    const tickerData = JSON.parse(fs.readFileSync(path.join(__dirname, 'ticker_data.json'), 'utf8'));
    res.json(tickerData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load ticker data' });
  }
});

// API endpoint to get posted tickers
app.get('/api/posted', (req, res) => {
  try {
    const posted = JSON.parse(fs.readFileSync(path.join(__dirname, 'posted_tickers.json'), 'utf8'));
    res.json(posted);
  } catch (error) {
    res.json([]); // Return empty array if file doesn't exist
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    publicUrl: process.env.PUBLIC_URL,
    timestamp: new Date().toISOString()
  });
});

// Scheduled update endpoint (for cron jobs)
app.get('/api/daily-update', (req, res) => {
  console.log('\n🔄 Scheduled update triggered...');
  const { exec } = require('child_process');
  
  exec('node update_charts.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Update failed:', err);
      return res.status(500).json({ 
        error: 'Update failed',
        details: err.message
      });
    }
    console.log('✅ Update completed successfully');
    res.json({ 
      success: true, 
      message: 'Update completed',
      timestamp: new Date().toISOString()
    });
  });
});

// 404 handler
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Short Caller Stock Ideas is live!`);
  console.log(`📱 Server running at http://localhost:${PORT}`);
  console.log(`🔗 Public URL: ${process.env.PUBLIC_URL || 'Not configured'}`);
  console.log(`📊 Ticker API: http://localhost:${PORT}/api/tickers`);
  console.log(`📜 Health check: http://localhost:${PORT}/api/health`);
});
