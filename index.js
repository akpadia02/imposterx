import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import fs from "fs";

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;
const username = "im.osterx.in";
const password = "imposter@15#12";
const cookiesFilePath = "./instagram_cookies.json";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Instagram Scraper API is running...");
});

const scrapeInstagram = async (profileUrl) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });

  if (fs.existsSync(cookiesFilePath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
    await page.setCookie(...cookies);
    console.log("✅ Loaded cookies.");
  }

  await page.goto("https://www.instagram.com/accounts/login/", { waitUntil: "networkidle2" });

  if (page.url() !== "https://www.instagram.com/") {
    await page.waitForSelector('input[name="username"]', { visible: true });
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (page.url().includes("challenge") || page.url().includes("two_factor")) {
      console.log("🔒 2FA DETECTED! Enter the code manually in the browser.");
      await page.waitForTimeout(120000);
    }

    const cookies = await page.cookies();
    fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies, null, 2));
    console.log("✅ Cookies saved.");
  }

  await page.goto(profileUrl, { waitUntil: "networkidle2" });
  await page.waitForSelector("body");
  const htmlContent = await page.content();
  const $ = cheerio.load(htmlContent);

  let followers = $("a[href$='/followers/'] > span").text().trim() || "Not Found";
  let following = $("a[href$='/following/'] > span").text().trim() || "Not Found";

  console.log(`👥 Followers: ${followers}`);
  console.log(`👤 Following: ${following}`);

  await browser.close();
  return { followers, following };
};

app.post("/scrape", async (req, res) => {
  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ error: "Profile URL is required" });
  }

  try {
    const data = await scrapeInstagram(profile);
    res.json(data);
  } catch (error) {
    console.error("🔥 Scraping Error:", error);
    res.status(500).json({ error: "Failed to scrape profile", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
