// import puppeteer from "puppeteer-extra";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import * as cheerio from "cheerio";
// import fs from "fs";

// puppeteer.use(StealthPlugin());

// const username = "imposterx.com.in";
// const password = "imposter@15#12";
// const cookiesFilePath = "./instagram_cookies.json";

// const scrapper = async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
//   );
//   await page.setViewport({ width: 1280, height: 800 });

//   // Load cookies if available
//   if (fs.existsSync(cookiesFilePath)) {
//     const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
//     await page.setCookie(...cookies);
//     console.log("✅ Loaded cookies.");
//   }

//   await page.goto("https://www.instagram.com/accounts/login/", {
//     waitUntil: "networkidle2",
//   });

//   // Check if already logged in
//   if (page.url() === "https://www.instagram.com/") {
//     console.log("✅ Already logged in!");
//   } else {
//     // Login process
//     await page.waitForSelector('input[name="username"]', { visible: true });
//     await page.type('input[name="username"]', username);
//     await page.type('input[name="password"]', password);
//     await page.click('button[type="submit"]');

//     // Wait to check if 2FA is triggered
//     await new Promise(resolve => setTimeout(resolve, 5000));
//     if (page.url().includes("challenge") || page.url().includes("two_factor")) {
//       console.log("🔒 2FA DETECTED! Please enter the verification code manually in the browser.");

//       // Wait for user input on 2FA screen (up to 2 minutes)
//       await page.waitForFunction(
//         () => document.querySelector('input[name="verificationCode"]') === null,
//         { timeout: 120000 } // 2 minutes timeout
//       );

//       console.log("✅ 2FA verification successful. Continuing...");
//     } else {
//       console.log("✅ Logged in without 2FA.");
//     }

//     // Save cookies after successful login
//     const cookies = await page.cookies();
//     fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies, null, 2));
//     console.log("✅ Cookies saved.");
//   }

//   // Navigate to target profile
//   const url = "https://www.instagram.com/gdg_rbu/";
//   await page.goto(url, { waitUntil: "networkidle2" });

//   // Wait for profile page
//   await page.waitForSelector("body");

//   // Get page content
//   const htmlContent = await page.content();

//   // Load into Cheerio
//   const $ = cheerio.load(htmlContent);

//   // Extract followers & following count
//   let followers = $("a[href$='/followers/'] > span").text().trim();
//   let following = $("a[href$='/following/'] > span").text().trim();

//   console.log(`👥 Followers: ${followers || "Not Found"}`);
//   console.log(`👤 Following: ${following || "Not Found"}`);

//   // Keep the browser open for debugging
//   await new Promise(resolve => setTimeout(resolve, 30000)); // Keeps browser open for 30 seconds before closing

//   await browser.close();
// };

// scrapper();
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import fs from "fs";

puppeteer.use(StealthPlugin());

const username = "im.osterx.in";
const password = "imposter@15#12";
const cookiesFilePath = "./instagram_cookies.json";

const scrapper = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });

  // Load cookies if available
  if (fs.existsSync(cookiesFilePath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
    await page.setCookie(...cookies);
    console.log("✅ Loaded cookies.");
  }

  await page.goto("https://www.instagram.com/accounts/login/", {
    waitUntil: "networkidle2",
  });

  // Check if already logged in
  if (page.url() === "https://www.instagram.com/") {
    console.log("✅ Already logged in!");
  } else {
    // Login process
    await page.waitForSelector('input[name="username"]', { visible: true });
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait to check if 2FA is triggered
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (page.url().includes("challenge") || page.url().includes("two_factor")) {
      console.log("🔒 2FA DETECTED! Please enter the verification code manually in the browser.");

      // Wait for user input on 2FA screen (up to 2 minutes)
      await page.waitForFunction(
        () => document.querySelector('input[name="verificationCode"]') === null,
        { timeout: 120000 } // 2 minutes timeout
      );

      console.log("✅ 2FA verification successful. Continuing...");
    } else {
      console.log("✅ Logged in without 2FA.");
    }

    // Save cookies after successful login
    const cookies = await page.cookies();
    fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies, null, 2));
    console.log("✅ Cookies saved.");
  }

  // Navigate to target profile
  const url = "https://www.instagram.com/gdg_rbu/";
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait for profile page
  await page.waitForSelector("body");

  // Get page content
  const htmlContent = await page.content();

  // Load into Cheerio
  const $ = cheerio.load(htmlContent);

  // Extract followers & following count
  let followers = $("a[href$='/followers/'] > span").text().trim();
  let following = $("a[href$='/following/'] > span").text().trim();

  console.log(`👥 Followers: ${followers || "Not Found"}`);
  console.log(`👤 Following: ${following || "Not Found"}`);

  // Keep the browser open for debugging
  await new Promise(resolve => setTimeout(resolve, 30000)); // Keeps browser open for 30 seconds before closing

  await browser.close();
};

scrapper();
