//------------------------------------------------------------------------------
// Everthing below is commonjs, saving it for a rainy day
// which in order to use
// the JASON doc need to have "type: commonjs" instead of "type: module"

const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

(async function example() {
  const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .build();

  await driver.get('https://www.google.com');
  const screenshot = await driver.takeScreenshot();
  fs.writeFileSync('screenshot.png', screenshot, 'base64');

  await driver.quit();
})();

// eveything below is ECMA script which is defined in JASON by "type: module"
// ECMA script doent support importing directories directly.

//------------------------------------------------------------------------------

