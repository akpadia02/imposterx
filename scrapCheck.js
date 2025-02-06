import * as fs from "fs";
import * as cheerio from "cheerio";

const scrapeFromHtml = (filePath) => {
  try {
    // Read the HTML file
    const htmlContent = filepath
    
    // Load the HTML into Cheerio
    const $ = cheerio.load(htmlContent);

    // Find the span elements containing the numbers
    const stats = $("header").find("span.x5n08af");
    
    if (stats.length >= 3) {
      const posts = $(stats[0]).text();
      const followers = $(stats[1]).text();
      const following = $(stats[2]).text();

      console.log(`Followers: ${followers}`);
      console.log(`Following: ${following}`);
      console.log(`Posts: ${posts}`);
    } else {
      console.error("Could not find the necessary data. Check the selectors.");
    }
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
  }
};

// Example usage: Pass the HTML file path as an argument
const filePath = "instagram_profile.html"; // Replace with your actual HTML file path
scrapeFromHtml(filePath);
