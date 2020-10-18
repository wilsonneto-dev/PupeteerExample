// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./crawler.d.ts" />
import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  // open the browser and go to site
  const page = await browser.newPage();
  // eslint-disable-next-line no-underscore-dangle
  await (page as any)._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: path.resolve('./'),
  });

  await page.goto(
    'https://seller.lgappstv.com/seller/secure/loginout/login.lge',
  );

  // in case of popups, just close it
  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.dismiss();
  });

  page.on('request', p => {});

  // signin
  await page.type('#USER_ID', 'devtvenc');
  await page.type('#USR_PW', 'federal2107');
  await page.click('input[type=button]');

  // go to reports page
  await page.waitForSelector('#topNavReport');
  await page.click('#topNavReport');

  // generate the 3 months report
  await page.waitForSelector('#appId');
  await page.select('#appId', '968075');

  // const [button] = await page.$x("//button[contains(., 'Button text')]");
  await page.evaluate(() => {
    setDate('m', 3);
    search(true);
  });

  await page.waitForSelector('#appId');
  await page.waitFor(1000);
  await page.evaluate(() => {
    excelDownload(10);
  });

  await page.waitFor(10000);
  await browser.close();
})();
