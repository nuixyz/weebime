import puppeteer from "puppeteer";
import fs from "fs";
import cron from "node-cron";

// Define the scraping function
const scrapeAnimeSchedule = async () => {
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
        // const poster = [...card.querySelectorAll(".poster")].map((image) =>
        //   image.getAttribute("src")
        // );
        const poster = card
          .querySelector('img[data-anime-card-target="poster"]')
          ?.getAttribute("src");
        const studio = card
          .querySelector(".anime-studios")
          ?.textContent?.trim();
        const animeDate = card
          .querySelector(".anime-date")
          ?.textContent?.trim();
        const genreText = [...card.querySelectorAll(".anime-tags")]
          .map((genre) => genre.textContent.trim())
          .join("");

        const genre = genreText.split(/(?=[A-Z])/).join(", ");
        return { title, poster, studio, animeDate, genre };
      });
    });

    await browser.close();

    const dir = "./ScrapedData";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

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
};

// Schedule the scraping task
cron.schedule("0 * * * *", scrapeAnimeSchedule);

// Fetch data immediately
scrapeAnimeSchedule();
