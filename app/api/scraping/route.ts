const { chromium } = require('playwright');
const { createObjectCsvWriter } = require('csv-writer');

// script start
async function run() {
  const url = 'https://news.ycombinator.com/jobs'; // URL for Hacker News jobs page

  await fetchHackerNewsData(url);
}

async function fetchHackerNewsData(url) {
  // create browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to the desired page
  console.log(`Going to page: ${url}....`);
  await page.goto(url);

  // save the articles
  const articles = await getArticles(page);

  // filter for software engineering jobs
  const filteredArticles = articles.filter(article => 
    /software|engineer|developer|programmer|backend|frontend|full stack|javascript/i.test(article.title)
  );

  // save articles to a CSV file
  console.log("Creating CSV file....");
  await saveToCsv(filteredArticles, 'hacker_news_software_engineering_jobs.csv');


  await browser.close();
}

async function getArticles(page) {
    let articles = [];
    let shouldContinue = true;
  
    while (shouldContinue) {
      await page.waitForTimeout(1000);
  
      const jobPosts = await page.evaluate(() => {
        const results = [];
        const items = document.querySelectorAll('.athing');
  console.log(items)
        items.forEach(item => {
          const titleElement = item.querySelector('.titleline > a');
          const title = titleElement ? titleElement.innerText : 'No title';
          const url = titleElement ? titleElement.href : 'Unknown link';
  
          const subtextElement = item.nextElementSibling.querySelector('.subtext');
          const timeElement = subtextElement.querySelector('.age');
          const time = timeElement ? timeElement.innerText : 'Unknown time';
  
          results.push({ title, url, time });
        });
  
        return results;
      });
  console.log(jobPosts)
      // Check if any job post is older than 7 days
      if (jobPosts.some(post => !isPostedWithinLastWeek(post.time))) {
        shouldContinue = false;
      }
  
      articles.push(...jobPosts);
  
      // Check if there is a "more" button
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

async function saveToCsv(data, fileName) {
  const csvWriter = createCsvWriter({
    path: fileName,
    header: [
      { id: 'title', title: 'Title' },
      { id: 'url', title: 'URL' }
    ]
  });

  // organizing data with headers
  const organizedData = data.map(item => ({
    title: item.title,
    url: item.url
  }));

  csvWriter.writeRecords(organizedData)
    .then(() => {
      console.log(`Data saved to ${fileName}.`);
    })
    .catch(err => {
      console.error('Error writing to CSV file:', err);
    });
}

(async () => {
  await run();
})();
