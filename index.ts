import { launch, Browser, Page, ElementHandle } from "puppeteer-core";

const clickElement = async (tag: string, regex: RegExp, page: Page) => {
  // Find the login button by matching its text content with a regular expression
  const element = await page.$(tag);
  if (element) {
    const buttonText = await element.evaluate((node) => node.textContent);
    if (buttonText && regex.test(buttonText)) {
      console.log(`found the ${tag}`);
      await Promise.all([page.waitForNavigation(), element.click()]);
    }
  }
};


const clickElementNoNavigation = async (
  tag: string,
  regex: RegExp,
  page: Page
) => {
  // Find the login button by matching its text content with a regular expression
  const element = await page.$(tag);
  if (element) {
    const buttonText = await element.evaluate((node) => node.textContent);
    if (buttonText && regex.test(buttonText)) {
      console.log(`found the ${tag}`);
      await Promise.all([element.click()]);
    }
  }
};

async function clickElementByXPath(page: Page, xpath: string) {
  const element = await page.$x(xpath);
  console.log({ element });
  if (element.length > 0) {
    console.log(`found xpath element ${xpath}`);
    const result = await Promise.all([
      (element[0] as ElementHandle<Element>).click(),
    ]);

    console.log({ result });
  }
}

export async function login(
  url: string,
  username: string,
  password: string,
  chromePath: string
): Promise<void> {
  const browser: Browser = await launch({
    executablePath: chromePath,
    headless: false,
    slowMo: 20,
  });
  const page: Page = await browser.newPage();

  try {
    await page.goto(url);

    // Wait for the username and password input fields to become visible
    await page.waitForSelector('input[placeholder="Username"]');
    await page.waitForSelector('input[placeholder="Password"]');

    // Fill in the username and password fields
    await page.type('input[placeholder="Username"]', username);
    await page.type('input[placeholder="Password"]', password);

    // Find the login button by matching its text content with a regular expression
    clickElement("button", /log\s?in/i, page);

    // Wait for the next page to load
    await page.waitForNavigation();

    // Wait for the select element to become visible
    await page.waitForSelector('select[name="I_would_like_to"]');

    // Click on the select element and select the option with value="RegisterExamChoice"
    await page.select('select[name="I_would_like_to"]', "RegisterExamChoice");

    const nextButtonXpath =
      '//*[@id="ServiceCommunityTemplate"]/div[2]/div/div[1]/div/div[3]/article/div/div/div[2]/footer/div[2]/button';

    clickElementByXPath(page, nextButtonXpath);

    await page.waitForFunction(() => {
      const text = "Click next to register for an exam.";
      const element = document.querySelector("body");
      console.log(element?.textContent);
      return element && element?.textContent?.includes(text);
    });

    // Wait for the image with class="profileIcon" to become visible
    await page.waitForSelector(".profileIcon");

    // Click on the image
    const profileIcon = await page.$(".profileIcon");
    if (profileIcon) {
      await profileIcon.click();
    }

    // clickElementByXPath(page, nextButtonXpath);
    const buttonText = "Next"; // the text content of the button element to select
    const buttonXPath = `//button[contains(text(), "${buttonText}")]`; // the XPath selector that targets the button element by its text content
    await page.waitForXPath(buttonXPath); // wait for the button to be present in the DOM
    const [buttonElement] = await page.$x(buttonXPath); // select the button element using XPath
    await (buttonElement as ElementHandle<Element>).click(); // click on the button
  } catch (error) {
    console.log("ERROR - THROWING ERROR");
    console.error(error);
  } finally {
      setTimeout(async () => {
        console.log("closing browser");
      await browser.close();
    }, 10000);
  }
}

const url = "https://ndeb-bned.my.site.com/s/";
// enter actual credentials or add as env variables and use from there
const userData = {
  usename: "username",
  pwd: "pwd",
};

login(
  url,
  userData.usename,
  userData.pwd,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
);
