import { launch } from "puppeteer-core";
export async function login(url, username, password, chromePath) {
  const browser = await launch({
    executablePath: chromePath,
    headless: false,
    slowMo: 100,
  });
  const page = await browser.newPage();
  try {
    await page.goto(url);

     // Wait for the username and password input fields to become visible
    await page.waitForSelector('input[placeholder="Username"]');
    await page.waitForSelector('input[placeholder="Password"]');

    // Fill in the username and password fields
    await page.type('input[placeholder="Username"]', username);
    await page.type('input[placeholder="Password"]', password);

    // Find the login button by matching its text content with a regular expression
    const loginButton = await page.$("button");
    if (loginButton) {
      const buttonText = await loginButton.evaluate((node) => node.textContent);
      const regex = /log\s?in/i;
      if (regex.test(buttonText)) {
        await Promise.all([page.waitForNavigation(), loginButton.click()]);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(async () => {
      await browser.close();
    }, 3000);
  }
}
const url = "https://ndeb-bned.my.site.com/s/";
const userData = {
  usename: "hellomayankashok@gmail.com",
  pwd: "Openndeb@1234#",
};
login(
  url,
  userData.usename,
  userData.pwd,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
);
