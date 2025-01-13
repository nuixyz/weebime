import puppeteer from "puppeteer";
import fs from "fs";
import cron from "node-cron";

cron.schedule("0 * * * *", async () => {
  console.log("Scraping anime schedule...");

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.livechart.me/winter-2025/tv", {
      waitUntil: "domcontentloaded",
    });

    const animeCardSelector = ".anime-card";
    await page.waitForSelector(animeCardSelector);

    const animeInfo = await page.$$eval(animeCardSelector, (animeCards) => {
      return animeCards.map((card) => {
        const title = card.querySelector(".main-title")?.textContent?.trim();
        const animeDate = card
          .querySelector(".anime-date")
          ?.textContent?.trim();
        const genreText = [...card.querySelectorAll(".anime-tags")]
          .map((genre) => genre.textContent.trim())
          .join(""); // First join everything

        // Split by capital letters and join with commas
        const genre = genreText
          .split(/(?=[A-Z])/) // Split before capital letters
          .join(", ");

        return { title, animeDate, genre };
      });
    });

    await browser.close();

    // Ensure directory exists
    const dir = "./ScrapedData";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Write data to JSON file
    fs.writeFileSync(
      `${dir}/animeSchedule.json`,
      JSON.stringify(animeInfo, null, 2)
    );

    console.log(
      "Data has been scraped and saved to animeSchedule.json successfully."
    );
  } catch (error) {
    console.error("An error occurred during scraping:", error);
  }
});
