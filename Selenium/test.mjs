
/**
 * Takes a screenshot of Google homepage and saves it in the "assets" folder.
 */
/**
 * Notes: Use JSDOM from NPM to manipulate aspects of the Browswer window 
 * Notes: Use npm fs-extra from npmto write files to HTML
 * 
 * By object provides a collection of locator strategies that can be used to find elements on a webpage. 
 * It includes methods like By.id(), By.css(), By.xpath()
 * 
 * Key object provides a set of special keys that can be used for keyboard interactions in Selenium. 
 * For example, Key.RETURN
 * 
 * until: The until object provides a collection of expected conditions that can be used in conjunction with the WebDriverWait class. 
 * It allows you to wait for certain conditions to be met before proceeding with the execution 
 */
import { Builder, By, Key, until, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { mouse, straightTo, Point  } from '@nut-tree/nut-js'
import { calculateSineLine } from './pointerTesting.mjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const keypress = require('keypress');
import fs from 'fs'; 
// look up path
import path from 'path';
import { moveMouse } from 'robotjs';
// control the mouse movement to mimic a human using the action class



async function setupDriver() {
  const chromeOptions = new chrome.Options();
  // chromeOptions.addArguments('') is used to add empty arguments to the list of Chrome command-line arguments. 
  // The addArguments() method allows you to specify additional command-line arguments to be passed to the Chrome browser when it starts.
  
  // We create an instance of Capabilities.chrome() to set the Chrome capabilities. 
  // Then, we use the set() method to configure the "chromeOptions" capability, which accepts an object that contains the desired Chrome options.
  const chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set("chromeOptions", {
    // capabilities found at https://peter.sh/experiments/chromium-command-line-switches/
    args: [
      "--disable-notifications",     // Disable browser notifications
      "--disable-popup-blocking",    // Disable popup blocking
      "--disable-web-security",      // Disable web security to allow cross-origin requests
      "--disable-extensions",        // Disable extensions
      "--disable-plugins",           // Disable plugins
      "--start-maximized",          // Start the browser maximized
      "--window-size=1920,1080",            
    ],
    prefs: {
      // In the prefs section of the code, the value of 2 is used to configure certain preferences related to cookies, 
      // images, and JavaScript. These values represent the following:
      //0: Allow
      //1: Block
      //2: Default behavior
      "profile.default_content_setting_values.cookies": 1,   // Block all cookies by default
      "profile.default_content_setting_values.images": 2,    // Disable loading of images
      "profile.default_content_setting_values.javascript": 0 // Disable JavaScript
    },
    // Add the enableAutomation capability to false
    //'w3c': false,
    //'excludeSwitches': ['enable-automation']
  });
  
  // create driver instance
  const driver = await new Builder().forBrowser('chrome')
      .withCapabilities(chromeCapabilities)
      .build();

      return driver;
}
let Xpath = '//textarea[@class="gLFyf" and @id="APjFqb" and @name="q" and @title="Search" and @type="search"]'

// function that handles what we are searching for and finds it
let findMouseTarget = async (driver, Xpath) =>{
    // pass the xpath in here
    await driver.wait(until.elementLocated(By.xpath(`${Xpath}`)));
    const searchInput = await driver.findElement(By.xpath(`${Xpath}`));
    return searchInput;
}

// function that controls the mouse movement using sine wave calculation and nut.js
//(startX, startY, endX, endY, speed, amplitude, frequency, initialDelay, finalDelay, finalArcHeight, arcDelay)
let mouseMove = async (startX, startY, endX, endY, speed, amplitude, frequency, initialDelay, finalDelay, finalArcHeight, arcDelay) => {
  let coordinates = await calculateSineLine(startX, startY, endX, endY, speed, amplitude, frequency, initialDelay, finalDelay, finalArcHeight, arcDelay);
  mouse.config.mouseSpeed = 800; // 100-2000 range
  for (const coordinate of coordinates) {
    const focus = new Point(coordinate.x, coordinate.y);
    await mouse.move(straightTo(focus.x, focus.y));
  }
}

// break out on keypress to avoid being trapped in infinite loops
const breakOut = () => {
  keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    process.exit();
  } else if(key && key.name == 'q') {
    console.log('You pressed "q". Stopping the execution...');
    process.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
}


// handle mouse movement
async function MoveMouseLikeCosineToXpath(driver, Xpath) {
  try{
    breakOut();
    oneSecondDelay(driver)
    // locate where we are moving to
    const searchInput = await findMouseTarget(driver, Xpath);
    // get the mouse start point
    const startPoint = await mouse.getPosition();
    // get the mouse end point
    const targetPoint = await searchInput.getRect();
    // Calculate the points
    await moveMouse()

    oneSecondDelay(driver)
    console.log('inside MoveMouseToXpath after oneSecDelay')
      // Move the mouse pointer along the calculated path
  
        // Click on the search bar
    //await searchInput.click();

        // Type a search query
    await searchInput.sendKeys('Forbes', Key.RETURN);
    twoSecondDelay(driver)
        // Wait for the search results to load
    await driver.wait(until.titleContains('Forbes'), 5000);
  }catch(err){
    console.error("An error occured: ", err)
  }finally{

  }
  }

async function twoSecondDelay(driver){
// make wait time random between 2 - 2.5 seconds
  await driver.sleep(2000 + Math.random() * 500);
}

async function oneSecondDelay(driver){
// make wait time random between 1 - 1.5 seconds
  await driver.sleep(1000 + Math.random() * 500);
}


async function findTarget(URL) {
  // Set up Selenium WebDriver
  const driver = await setupDriver();

  try {
    // Navigate to Google
    // URL goes here
    await driver.get('https://www.google.com');

    twoSecondDelay(driver)
    // sets browser window
    await driver.manage().window().setRect({ x: 0, y: 0, width: 1280, height: 720 }); // Adjust the position and size as needed
    
    oneSecondDelay(driver)
    
    
    // Find the Google search bar
    
//--------------------------------------------------------------------------------------------------------------------
    // Get the location of the search bar
    

  MoveMouseLikeCosineToXpath(driver, Xpath, 400, 50, 20, 1, 1, 20, 10, 5)
//-------------------------------------------------------------------------------------------------------------------------
    twoSecondDelay(driver)

    // Perform other actions on the search results page if needed

    try{
      // Close the browser with a time delay
      setTimeout(async function(){
        await driver.quit();
      },5000)
    }catch(error){
      console.error('Error:', error);
      await driver.quit()
    }

  }catch (error) {
    console.error('Error:', error);
    // Close the browser in case of an error
    await driver.quit();
  }
}

findTarget()
// async function screenshot() {

//   const driver = await setupDriver();
//   try {
//     // navigate to website
//     await driver.get('https://www.google.com');
//     // take a screenshot and save it to "assets"
//     const screenshot = await driver.takeScreenshot();
//     // look this up
//     const directoryName = path.dirname(new URL(import.meta.url).pathname);
//     const filePath = path.join(directoryName, 'assets', 'screenshot.png');
//     fs.writeFileSync(filePath, screenshot, 'base64');
//     console.log(`Screenshot saved in ${filePath}`);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     // close the browser
//     console.log('execution succesful')
//     await driver.quit();
//   }
// }

// screenshot();

// function findPagetarget(event){
//   return new Promise(function(resolve){
//       let type = event.target.innerText
//       if (type){
//           type = type.slice(0, type.length-1)
//           initVal = type
//           resolve(type)
//       }
//   })
// }



// async function performMouseActions(driver) {
  
  
//   const actions = driver.actions({ bridge: true });

//   // Move the mouse to a specific element
//   const element = await driver.findElement(By.css("#myElement"));
//   await actions.move({ origin: element }).perform();

//   // Click and hold at the current mouse location
//   await actions.clickAndHold().perform();

//   // Move the mouse to a different location
//   await actions.move({ x: 100, y: 100 }).perform();

//   // Release the mouse click
//   await actions.release().perform();
// }
// async function mouseToTarget(){

// }

/*
Using the path module to construct the file path to save the screenshot.
__dirname global variable contains the directory name of the current module,
and joining it with the "assets" folder and the filename "screenshot.png".
The resulting file path is then used to save the screenshot
using fs.writeFileSync().
  */


// Call the function to perform the search
