// With show more openings buttom pressing:

const puppeteer = require('puppeteer');

const url = 'https://www.uber.com/us/en/careers/teams/university/';
// const url =  'https://www.goldmansachs.com/careers/students/programs-and-internships'; # Doesn't work as well for general websites

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Click the "Show more openings" button 5 times
  for (let i = 0; i < 5; i++) {
    try {
        // Wait for the button to be visible
        await page.waitForSelector('button.css-lbOvOr', { timeout: 5000 });
        
        // Click the button
        await page.click('button.css-lbOvOr');
        
        // Wait for new openings to load
        await page.waitForTimeout(50); // Adjust timeout if necessary
    } catch (error) {
        console.log("Button not found or could not be clicked:", error);
        break; // Exit the loop if the button isn't found
    }
  }

  // Get the inner text of the body
  const text = await page.evaluate(() => {
    return document.body.innerText;
  });

  // Split the text into lines and filter for "intern"
  const internLines = text.split('\n').filter(line => line.toLowerCase().includes('intern'));

  // Log each line
  console.log("Lines containing 'intern':");
  internLines.forEach(line => {
    console.log(line.trim());
  });

  // Optionally, extract structured data if needed
  const structuredData = await page.evaluate(() => {
    const h2Elements = Array.from(document.querySelectorAll('h2'));
    return h2Elements.map(el => el.innerText);
  });

  console.log("\nStructured Data (H2 Elements):");
  structuredData.forEach(data => {
    console.log(data.trim());
  });

  await browser.close();
})();