import { createObjectCsvWriter } from "csv-writer";
import { NextResponse } from "next/server";
import { chromium, Browser, Page } from "playwright";
import path from "path";
import fs from "fs";
import axios from "axios";

interface professorRating {
  name: string;
  department: string;
  school: string;
  rating: string;
  numRatings: string;
  difficulty: string;
  wouldTakeAgain: string;
}

export async function POST(req: Request, res: NextResponse) {
  try {
    //   const url = 'https://news.ycombinator.com/jobs';
    const body = await req.json();
    const { url } = body;

    const browser: Browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page: Page = await context.newPage();

    console.log(`Navigating to page: ${url}....`);
    await page.goto(url);

    const professorDetails = await page.evaluate(() => {
      const name = `${
        document.querySelector('[class^="NameTitle__Name"] span')
          ?.textContent || ""
      } ${
        document.querySelector('[class^="NameTitle__LastNameWrapper"]')
          ?.textContent || ""
      }`.trim();
      const department =
        document.querySelector(
          '[class^="TeacherDepartment__StyledDepartmentLink"]'
        )?.textContent || "";
      const school =
        document.querySelector(
          '[class^="NameTitle__Title"] a[href*="/school/"]'
        )?.textContent || "";
      const rating =
        document.querySelector('[class^="RatingValue__Numerator"]')
          ?.textContent || "";
      const numRatings =
        document
          .querySelector('[class^="RatingValue__NumRatings"] a')
          ?.textContent?.split(" ")[0] || "";
      const difficulty =
        document.querySelector('[class^="FeedbackItem__FeedbackNumber"]')
          ?.textContent || "";
      const wouldTakeAgain =
        document.querySelectorAll('[class^="FeedbackItem__FeedbackNumber"]')[1]
          ?.textContent || "";
      const professorRating = {
        name,
        department,
        school,
        rating,
        numRatings,
        difficulty,
        wouldTakeAgain,
      };
      return professorRating;
    });
    
    await browser.close();
    const saveToFileName = path.resolve(process.cwd(), "professor-ratings.csv");
    saveToCsv(professorDetails, saveToFileName);

    // auto-embed scraped data
    await axios.get(`${process.env.BACKEND_URL}/api/auto-embedding`);

    return NextResponse.json(
      { message: "Jobs fetched and saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching professor ratings:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
async function saveToCsv(
  rating: professorRating,
  fileName: string
): Promise<void> {
  const csvWriter = createObjectCsvWriter({
    path: fileName,
    header: [
      { id: "name", title: "Name" },
      { id: "department", title: "Department" },
      { id: "school", title: "School" },
      { id: "rating", title: "Rating" },
      { id: "numRatings", title: "NumRatings" },
      { id: "difficulty", title: "Difficulty" },
      { id: "wouldTakeAgain", title: "WouldTakeAgain" },
    ],

    append: fs.existsSync(fileName),
  });

  try {
    await csvWriter.writeRecords([rating]);
    console.log(`Data saved to ${fileName}.`);
  } catch (err) {
    console.error("Error writing to CSV file:", err);
    throw err;
  }
}
