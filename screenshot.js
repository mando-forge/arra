import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  
  // Set viewport for a standard desktop resolution
  await page.setViewport({ width: 1440, height: 900 });
  
  // Navigate to localhost
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // Wait an extra second for any animations or fonts to load
  await new Promise(r => setTimeout(r, 2000));
  
  // Take full page screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  await browser.close();
})();
