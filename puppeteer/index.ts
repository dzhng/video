const puppeteer = require('puppeteer');
const callUrl = 'https://tinyurl.com/50simcall';
// let callNumber = 1;
const launchCall = async (callNumber) => {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ['--use-fake-ui-for-media-stream'],
  });
  const page = await browser.newPage();
  await page.goto(callUrl);
  page.waitForTimeout(10000).then(() => {
    console.log('finished waiting');
    page.type('input', callNumber.toString()).then(() => {
      page.waitForTimeout(2000);
      page.click('.MuiButton-label');
      page.waitForSelector('[data-testid=mic-icon]').then(() => {
        page.click('[data-testid=mic-icon]');
        page.waitForTimeout(2000).then(() => {
          page.click('.MuiButton-label');
          page.waitForTimeout(30000).then(() => {
            // page.click("[title=End Call [E]]")
            browser.close();
          });
        });
      });
    });
  });
};

for (let i = 0; i < 17; i++) {
  launchCall(i + 1);
}
