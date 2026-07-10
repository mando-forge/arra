const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    const args = msg.args().map(arg => arg.toString());
    if (msg.type() === 'error') {
      console.error(`[PAGE CONSOLE] ERROR: ${msg.text()}`, ...args);
    } else if (msg.text().includes('[STREAM CHUNK]')) {
      console.log(`[PAGE CONSOLE] STREAM: ${msg.text()}`, ...args);
    } else {
      console.log(`[PAGE CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`, ...args);
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR]: ${err.message}`);
  });
  
  page.on('error', err => {
    console.log(`[ERROR]: ${err.message}`);
  });
  
  page.on('request', req => {
    if (req.url().includes('/chat') || req.url().includes('functions')) {
      console.log('[NETWORK REQUEST]', req.method(), req.url());
    }
  });
  
  page.on('response', async res => {
    if (res.url().includes('/chat') || res.url().includes('functions')) {
      console.log('[NETWORK RESPONSE]', res.status(), res.url());
    }
  });

  page.on('request', request => {
    const url = request.url();
    if (url.startsWith('http://localhost:') || url.includes('supabase.co')) {
      if (request.method() === 'POST' && url.includes('/chat')) {
        console.log(`[NETWORK] Chat Request: ${request.method()} ${url}`);
        console.log(`[NETWORK] Chat Request Headers:`, request.headers());
        console.log(`[NETWORK] Chat Request Body: ${request.postData()}`);
      }
    }
  });

  page.on('requestfailed', request => {
    if (request.url().includes('functions/v1/chat')) {
      console.log(`[NETWORK] Chat Request Failed: ${request.failure()?.errorText}`);
    }
  });

  // Collect network responses
  page.on('response', async response => {
    if (response.url().includes('functions/v1/chat')) {
      console.log(`[NETWORK] Chat Response Status: ${response.status()}`);
      console.log(`[NETWORK] Chat Response Headers:`, await response.allHeaders());
      try {
        const text = await response.text();
        console.log(`[NETWORK] Chat Response Body:`, text);
      } catch (e) {
        console.log(`[NETWORK] Could not read response body: ${e.message}`);
      }
    }
  });

  try {
    console.log('Navigating to http://localhost:5173/chat...');
    await page.goto('http://localhost:5173/chat');
    
    console.log('Waiting for network idle...');
    await page.waitForLoadState('networkidle');

    console.log('Typing message...');
    const input = await page.getByPlaceholder('Type a message...').or(page.getByPlaceholder('Enter API key above to start')).or(page.getByPlaceholder('Query...')).or(page.getByPlaceholder('Locked'));
    await input.fill('hello');
    
    console.log('Clicking send...');
    await page.locator('form button[type="submit"]').click();
    
    console.log('Waiting for streaming to finish...');
    await page.waitForTimeout(5000);
    
    const rawMessages = await page.evaluate(() => {
      return document.getElementById('debug-raw-messages')?.textContent || '[]';
    });
    console.log("[DEBUG RAW MESSAGES]", rawMessages);

    console.log("Extracting messages...");
    const pageText = await page.innerText('body');
    console.log("Page Text:", pageText);
    
    fs.mkdirSync('scratch', { recursive: true });
    await page.screenshot({ path: 'scratch/debug-screenshot.png' });
    await page.waitForTimeout(5000); // Wait 5s before closing to capture network responses
    
  } catch (err) {
    console.error('Error during script execution:', err);
  } finally {
    await browser.close();
  }
})();
