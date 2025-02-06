// import express from "express";
// import cors from "cors";
// import puppeteer from "puppeteer-extra";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import * as cheerio from "cheerio";
// import fs from "fs";

// puppeteer.use(StealthPlugin());

// const app = express();
// const PORT = process.env.PORT || 3000;
// const username = "im.osterx.in";
// const password = "imposter@15#12";
// const cookiesFilePath = "./instagram_cookies.json";

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("🚀 Instagram Scraper API is running...");
// });

// const scrapeInstagram = async (profileUrl) => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
//   );
//   await page.setViewport({ width: 1280, height: 800 });

//   if (fs.existsSync(cookiesFilePath)) {
//     const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
//     await page.setCookie(...cookies);
//     console.log("✅ Loaded cookies.");
//   }

//   await page.goto("https://www.instagram.com/accounts/login/", { waitUntil: "networkidle2" });

//   if (page.url() !== "https://www.instagram.com/") {
//     await page.waitForSelector('input[name="username"]', { visible: true });
//     await page.type('input[name="username"]', username);
//     await page.type('input[name="password"]', password);
//     await page.click('button[type="submit"]');

//     await new Promise(resolve => setTimeout(resolve, 5000));
//     if (page.url().includes("challenge") || page.url().includes("two_factor")) {
//       console.log("🔒 2FA DETECTED! Enter the code manually in the browser.");
//       await page.waitForTimeout(120000);
//     }

//     const cookies = await page.cookies();
//     fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies, null, 2));
//     console.log("✅ Cookies saved.");
//   }

//   await page.goto(profileUrl, { waitUntil: "networkidle2" });
//   await page.waitForSelector("body");
//   const htmlContent = await page.content();
//   const $ = cheerio.load(htmlContent);

//   let followers = $("a[href$='/followers/'] > span").text().trim() || "Not Found";
//   let following = $("a[href$='/following/'] > span").text().trim() || "Not Found";

//   console.log(`👥 Followers: ${followers}`);
//   console.log(`👤 Following: ${following}`);

//   await browser.close();
//   return { followers, following };
// };

// app.post("/scrape", async (req, res) => {
//   const { profile } = req.body;
//   if (!profile) {
//     return res.status(400).json({ error: "Profile URL is required" });
//   }

//   try {
//     const data = await scrapeInstagram(profile);
//     res.json(data);
//   } catch (error) {
//     console.error("🔥 Scraping Error:", error);
//     res.status(500).json({ error: "Failed to scrape profile", details: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// export default app;





// import express from "express";
// import cors from "cors";
// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import puppeteerExtra from "puppeteer-extra";
// import * as cheerio from "cheerio";
// import fs from "fs";

// puppeteerExtra.use(StealthPlugin());
// const app = express();
// const PORT = process.env.PORT || 3000;
// const username = "your_username";
// const password = "your_password";
// const cookiesFilePath = "./instagram_cookies.json"; // Use /tmp for serverless environments

// // Enable CORS for all origins
// app.use(cors());
// app.use(express.json());

// const scrapeInstagram = async (profileUrl) => {
//   const browser = await puppeteer.launch({
//     headless: true, // Run in headless mode
//     executablePath: require('puppeteer').executablePath() // Use installed Chromium
//   });
  

//   const page = await browser.newPage();
//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
//   );
//   await page.setViewport({ width: 1280, height: 800 });

//   // Load saved cookies
//   if (fs.existsSync(cookiesFilePath)) {
//     const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
//     await page.setCookie(...cookies);
//   }

//   await page.goto("https://www.instagram.com/accounts/login/", {
//     waitUntil: "networkidle2",
//     timeout: 60000,
//   });

//   // If still on login page, log in and save cookies
//   if (page.url().includes("accounts/login")) {
//     await page.waitForSelector('input[name="username"]', { visible: true });
//     await page.type('input[name="username"]', username, { delay: 100 });
//     await page.type('input[name="password"]', password, { delay: 100 });
//     await page.click('button[type="submit"]');
//     await page.waitForNavigation({ waitUntil: "networkidle2" });

//     // Handle potential 2FA if needed
//     if (page.url().includes("checkpoint")) {
//       console.log("2FA Required! Please enter the code...");
//       await new Promise(resolve => setTimeout(resolve, 10000)); // Adjust timeout as necessary
//     }

//     // Save cookies after login
//     const cookies = await page.cookies();
//     fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies, null, 2));
//   }

//   // Go to target profile
//   await page.goto(profileUrl, { waitUntil: "networkidle2", timeout: 60000 });
//   await page.waitForSelector("body");

//   // Extract page content
//   const htmlContent = await page.content();
//   const $ = cheerio.load(htmlContent);

//   // Extract followers & following counts (Works for private & public profiles)
//   const followers = await page.evaluate(() => {
//     return document.querySelector('a[href$="/followers/"] span')?.textContent?.trim() || "Not Found";
//   });

//   const following = await page.evaluate(() => {
//     return document.querySelector('a[href$="/following/"] span')?.textContent?.trim() || "Not Found";
//   });

//   // Extract post count
//   const postCount = $("header section span span").first().text().trim() || "Not Found";

//   // Check if the account is private
//   const isPrivate = await page.evaluate(() => {
//     return document.querySelector("h2")?.innerText.includes("This Account is Private");
//   });

//   let firstPostLikes = "Not Available";
//   let firstPostComments = "Not Available";

//   if (!isPrivate) {
//     try {
//       firstPostLikes = await page.$eval("article div div div div a", (el) => el.innerText.trim());
//       firstPostComments = await page.$eval("article div div div div a", (el) => el.innerText.trim());
//     } catch (error) {
//       console.log("Couldn't retrieve likes/comments, likely due to changes in the layout.");
//     }
//   }

//   await browser.close();
//   return {
//     profileUrl,
//     followers,
//     following,
//     posts: postCount,
//     firstPostLikes,
//     firstPostComments,
//     isPrivate,
//   };
// };

// // POST endpoint to scrape Instagram profile
// app.post("/scrape", async (req, res) => {
//   const { profile } = req.body;
//   if (!profile) {
//     return res.status(400).json({ error: "Profile URL is required" });
//   }

//   try {
//     const data = await scrapeInstagram(profile);
//     res.json(data);
//   } catch (error) {
//     console.error("Scraping Error:", error);
//     res.status(500).json({ error: "Failed to scrape profile", details: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// export default app;


// index.js

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import fs from "fs";

// -- If you're using ES Modules, you need this for __dirname-like functionality
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;
const username = "im.osterx.in";
const password = "imposter@15#12";
const cookiesFilePath = "./instagram_cookies.json";

// Middleware
app.use(cors());
app.use(express.json());

// 1. Serve all files in the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// 2. When user visits the root path '/', send 'index.html'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -- Scraping function
const scrapeInstagram = async (profileUrl) => {
  // NOTE: For deployment on Render, you may want to run headless: true
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });

  // -- Load existing cookies if available
  if (fs.existsSync(cookiesFilePath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
    await page.setCookie(...cookies);
    console.log("✅ Loaded cookies.");
  }

  // -- Go to Instagram login
  await page.goto("https://www.instagram.com/accounts/login/", {
    waitUntil: "networkidle2",
  });

  // -- Check if we need to log in
  if (page.url() !== "https://www.instagram.com/") {
    await page.waitForSelector('input[name="username"]', { visible: true });
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // -- Wait for possible 2FA
    await new Promise((resolve) => setTimeout(resolve, 5000));
    if (page.url().includes("challenge") || page.url().includes("two_factor")) {
      console.log("🔒 2FA DETECTED! Enter the code manually in the browser.");
      await page.waitForTimeout(120000);
    }

    // -- Save cookies
    const cookies = await page.cookies();
    fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies, null, 2));
    console.log("✅ Cookies saved.");
  }

  // -- Navigate to target profile
  await page.goto(profileUrl, { waitUntil: "networkidle2" });
  await page.waitForSelector("body");

  // -- Extract data with Cheerio
  const htmlContent = await page.content();
  const $ = cheerio.load(htmlContent);

  let followers =
    $("a[href$='/followers/'] > span").text().trim() || "Not Found";
  let following =
    $("a[href$='/following/'] > span").text().trim() || "Not Found";

  console.log(`👥 Followers: ${followers}`);
  console.log(`👤 Following: ${following}`);

  await browser.close();
  return { followers, following };
};

// -- POST route to scrape
app.post("/scrape", async (req, res) => {
  const { profile } = req.body;
  if (!profile) {
    return res
      .status(400)
      .json({ error: "Profile URL is required" });
  }

  try {
    const data = await scrapeInstagram(profile);
    res.json(data);
  } catch (error) {
    console.error("🔥 Scraping Error:", error);
    res.status(500).json({
      error: "Failed to scrape profile",
      details: error.message,
    });
  }
});

// -- Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
