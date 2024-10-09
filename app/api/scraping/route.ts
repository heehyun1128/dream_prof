
import { chromium, Browser, Page } from 'playwright';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';
import axios from 'axios';


type JobPost = {
  title: string;
  url: string;
  time: string;
};

type Data = {
  message: string;
  fileName?: string;
  error?: string;
};

export async function POST(req: Request, res: NextResponse<Data>) {


//   const url = 'https://news.ycombinator.com/jobs';
const body = await req.json();
const { url } = body;
console.log("url",url)

  try {
    const jobs = await fetchHackerNewsData(url);
    const fileName = path.resolve(process.cwd(), 'hacker_news_software_engineering_jobs.csv');
    await saveToCsv(jobs, fileName);
    await axios.get(`${process.env.BACKEND_URL}/api/auto-embedding`)
    return NextResponse.json({ message: 'Jobs fetched and saved successfully', fileName },{status:200})
} catch (error) {
    console.error('Error fetching Hacker News jobs:', error);
    
    return NextResponse.json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error'},{status:500})
  }
}

async function fetchHackerNewsData(url: string): Promise<JobPost[]> {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  console.log(`Navigating to page: ${url}....`);
  await page.goto(url);

  const articles = await getArticles(page);

  const filteredArticles = articles.filter(article => 
    /software|engineer|developer|programmer|backend|frontend|full stack|javascript/i.test(article.title)
  );

  await browser.close();
  return filteredArticles;
}

async function getArticles(page: Page): Promise<JobPost[]> {
  const articles: JobPost[] = [];
  let shouldContinue = true;

  while (shouldContinue) {
    await page.waitForTimeout(1000);

    const jobPosts: JobPost[] = await page.evaluate(() => {
      const results: JobPost[] = [];
      const items = document.querySelectorAll('.athing');

      items.forEach(item => {
        const titleElement = item.querySelector('.titleline > a') as HTMLAnchorElement | null;
        const title = titleElement ? titleElement.innerText : 'No title';
        const url = titleElement ? titleElement.href : 'Unknown link';

        const subtextElement = item.nextElementSibling?.querySelector('.subtext');
        const timeElement = subtextElement?.querySelector('.age') as HTMLAnchorElement | null;
        const time = timeElement ? timeElement.innerText : 'Unknown time';

        results.push({ title, url, time });
      });

      return results;
    });

    if (jobPosts.some(post => !isPostedWithinLastWeek(post.time))) {
      shouldContinue = false;
    }

    articles.push(...jobPosts);

    const moreButton = await page.$('a.morelink');
    if (moreButton && shouldContinue) {
      await moreButton.click();
      await page.waitForTimeout(2000); 
    } else {
      shouldContinue = false;
    }
  }

  return articles;
}

function isPostedWithinLastWeek(time: string): boolean {
  return !/(\d+\s+days?\s+ago)/i.test(time);
}

async function saveToCsv(data: JobPost[], fileName: string): Promise<void> {
  const csvWriter = createObjectCsvWriter({
    path: fileName,
    header: [
      { id: 'title', title: 'Title' },
      { id: 'url', title: 'URL' },
      { id: 'time', title: 'Time' } 
    ],
    append: fs.existsSync(fileName) 
  });

  const organizedData = data.map(item => ({
    title: item.title,
    url: item.url,
    time: item.time
  }));

  
  try {
    await csvWriter.writeRecords(organizedData);
    console.log(`Data saved to ${fileName}.`);
    
  } catch (err) {
    console.error('Error writing to CSV file:', err);
    throw err;
  }
}
