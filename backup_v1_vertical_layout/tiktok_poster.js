const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration - You'll add your TikTok API credentials to .env file
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || '';
const TIKTOK_VIDEO_ID = process.env.TIKTOK_VIDEO_ID || ''; // Optional: for updating existing videos

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v1';
const POSTED_TIKTOKS_FILE = path.join(__dirname, 'posted_tiktoks.json');

// Logger function (mirrors the main script)
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  // Append to log file
  fs.appendFileSync(
    path.join(__dirname, 'tiktok_poster.log'),
    logMessage + '\n',
    { encoding: 'utf8' }
  );
}

/**
 * Check if a ticker has already been posted to TikTok
 */
function isTickerPostedToTikTok(ticker) {
  try {
    if (!fs.existsSync(POSTED_TIKTOKS_FILE)) {
      return false;
    }
    const posted = JSON.parse(fs.readFileSync(POSTED_TIKTOKS_FILE, 'utf8'));
    return posted.includes(ticker);
  } catch (err) {
    log(`Error checking posted TikToks: ${err.message}`);
    return false;
  }
}

/**
 * Mark a ticker as posted to TikTok
 */
function markTickerPostedToTikTok(ticker) {
  try {
    let posted = [];
    if (fs.existsSync(POSTED_TIKTOKS_FILE)) {
      posted = JSON.parse(fs.readFileSync(POSTED_TIKTOKS_FILE, 'utf8'));
    }
    if (!posted.includes(ticker)) {
      posted.push(ticker);
      fs.writeFileSync(POSTED_TIKTOKS_FILE, JSON.stringify(posted, null, 2), 'utf8');
      log(`Marked ${ticker} as posted to TikTok`);
    }
  } catch (err) {
    log(`Error marking ticker as posted: ${err.message}`);
  }
}

/**
 * Create TikTok caption for a stock ticker
 */
function generateCaption(ticker, currentPrice, targetPrice, ratingCount) {
  const priceStr = currentPrice ? `$${currentPrice}` : 'N/A';
  const targetStr = targetPrice ? `$${targetPrice}` : 'N/A';
  const ratingsStr = ratingCount > 0 ? `💼 ${ratingCount} analyst ratings` : '📊 Tracking';
  
  return [
    `🚀 NEW STOCK PICK: ${ticker}`,
    ``,
    `Current Price: ${priceStr}`,
    `Price Target: ${targetStr}`,
    `${ratingsStr}`,
    ``,
    `#ShortSqueeze #StockIdeas #Trading #StockMarket #ShortCaller #DayTrading #FinanceEducation`
  ].join('\n');
}

/**
 * Create video content using chart and text overlay
 * For now, this creates a simple text-based post
 * In production, you'd generate an actual video with chart images
 */
async function createVideoContent(ticker, data) {
  try {
    // For TikTok, we need video content
    // This is a placeholder that would integrate with a video generation service
    // In production, you'd use something like:
    // - FFmpeg to create videos with overlays
    // - Remotion for programmatic video generation
    // - A third-party service like Synthesia
    
    const caption = generateCaption(
      ticker,
      data.currentPrice,
      data.targetPrice,
      data.ratings ? data.ratings.length : 0
    );
    
    log(`Generated caption for ${ticker}: ${caption.substring(0, 50)}...`);
    
    return {
      caption: caption,
      videoPath: null // Set to actual video path when implemented
    };
  } catch (err) {
    log(`Error creating video content for ${ticker}: ${err.message}`);
    return null;
  }
}

/**
 * Post to TikTok using the official API
 * Requires TikTok OAuth token with video.upload scope
 */
async function postToTikTok(ticker, data) {
  return new Promise((resolve) => {
    if (!TIKTOK_ACCESS_TOKEN) {
      log(`⚠️  TikTok API token not configured. Skipping TikTok post for ${ticker}`);
      log(`Set TIKTOK_ACCESS_TOKEN environment variable to enable posting`);
      resolve(false);
      return;
    }

    try {
      const content = generateCaption(
        ticker,
        data.currentPrice,
        data.targetPrice,
        data.ratings ? data.ratings.length : 0
      );

      // Create request to TikTok API
      // Note: Actual video upload requires multipart form data with video file
      // This example shows the text/caption-based approach
      
      const requestData = JSON.stringify({
        data: {
          caption: content,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          video_title: `Short Caller: ${ticker}`,
          disable_comment: false,
          disable_duet: false,
          disable_stitch: false,
          show_author_name: true
        }
      });

      const options = {
        hostname: 'open.tiktokapis.com',
        port: 443,
        path: '/v1/post/publish/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData),
          'Authorization': `Bearer ${TIKTOK_ACCESS_TOKEN}`
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const jsonResponse = JSON.parse(responseData);
            
            if (res.statusCode === 200) {
              log(`✅ Successfully posted ${ticker} to TikTok`);
              markTickerPostedToTikTok(ticker);
              resolve(true);
            } else if (res.statusCode === 429) {
              log(`⚠️  Rate limited on TikTok API. Will retry ${ticker} later`);
              resolve(false);
            } else {
              log(`❌ TikTok API error: ${jsonResponse.error?.message || responseData}`);
              resolve(false);
            }
          } catch (err) {
            log(`Error parsing TikTok response: ${err.message}`);
            resolve(false);
          }
        });
      });

      req.on('error', (err) => {
        log(`❌ Error posting to TikTok: ${err.message}`);
        resolve(false);
      });

      req.write(requestData);
      req.end();

    } catch (err) {
      log(`Error in TikTok API call: ${err.message}`);
      resolve(false);
    }
  });
}

/**
 * Create a text-based social media post (fallback method)
 * This can be used to generate content for manual posting or other platforms
 */
function generateSocialPost(ticker, data) {
  const caption = generateCaption(
    ticker,
    data.currentPrice,
    data.targetPrice,
    data.ratings ? data.ratings.length : 0
  );
  
  return {
    platform: 'tiktok',
    ticker: ticker,
    caption: caption,
    timestamp: new Date().toISOString(),
    data: {
      currentPrice: data.currentPrice,
      targetPrice: data.targetPrice,
      ratings: data.ratings ? data.ratings.length : 0
    }
  };
}

/**
 * Main function: Post new tickers to TikTok
 */
async function postNewTickersToTikTok(newTickers, tickerData) {
  log(`\n========== TikTok Posting Started ==========`);
  
  let successCount = 0;
  let skippedCount = 0;

  for (const ticker of newTickers) {
    // Skip if already posted
    if (isTickerPostedToTikTok(ticker)) {
      log(`⏭️  ${ticker} already posted to TikTok, skipping`);
      skippedCount++;
      continue;
    }

    const data = tickerData[ticker];
    if (!data) {
      log(`⚠️  No data found for ${ticker}, skipping TikTok post`);
      continue;
    }

    log(`\n📱 Processing TikTok post for ${ticker}...`);
    
    // Generate content
    const content = generateSocialPost(ticker, data);
    
    // Save content to file for reference
    try {
      const contentFile = path.join(__dirname, `tiktok_posts_${new Date().toISOString().split('T')[0]}.json`);
      let posts = [];
      if (fs.existsSync(contentFile)) {
        posts = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
      }
      posts.push(content);
      fs.writeFileSync(contentFile, JSON.stringify(posts, null, 2), 'utf8');
    } catch (err) {
      log(`Warning: Could not save post content: ${err.message}`);
    }

    // Attempt to post
    const success = await postToTikTok(ticker, data);
    
    if (success) {
      successCount++;
      // Add small delay between posts to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  log(`\n========== TikTok Posting Completed ==========`);
  log(`✅ Successfully posted: ${successCount}`);
  log(`⏭️  Skipped (already posted): ${skippedCount}`);
  log(`\n`);
}

module.exports = {
  postNewTickersToTikTok,
  generateCaption,
  generateSocialPost,
  isTickerPostedToTikTok,
  markTickerPostedToTikTok
};
