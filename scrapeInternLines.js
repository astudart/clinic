const { Builder, By, until } = require('selenium-webdriver');

// List of URLs and their associated button selectors
const jobSites = [
  {
    url: 'https://www.lyft.com/careers/early-talent?locale_language=en-US',
    buttonSelector: '', // Button selector for Lyft
    companyName: 'Lyft' // Company name for the dictionary
  },
  {
    url: 'https://www.uber.com/us/en/careers/teams/university/',
    buttonSelector: 'button.css-lbOvOr', // Button selector for Uber
    companyName: 'Uber' // Company name for the dictionary
  },
  {
    url: 'https://www.goldmansachs.com/careers/students/programs-and-internships',
    buttonSelector: '', // No button for this URL
    companyName: 'Goldman Sachs' // Company name for the dictionary
  },
  {
    url: 'https://www.palantir.com/careers/',
    buttonSelector: 'button.ptcom-design__listButton__13gdc5u', // Button selector for Palantir
    companyName: 'Palantir' // Company name for the dictionary
  },
  // Add more sites as needed
];

(async () => {
  const driver = await new Builder().forBrowser('chrome').build();
  
  // Object to store company openings
  let jobOpenings = {};

  for (const site of jobSites) {
    try {
      await driver.get(site.url);

      // Array to store job listings for the current company
      let companyJobListings = [];

      // Click the button multiple times if it exists
      if (site.buttonSelector) {
        for (let i = 0; i < 5; i++) {
          try {
            // Wait for the button to be clickable
            const showMoreButton = await driver.wait(
              until.elementLocated(By.css(site.buttonSelector)),
              5000
            );
            await driver.wait(until.elementIsVisible(showMoreButton), 5000);
            await showMoreButton.click();

            // Wait for new content to load
            await driver.sleep(3000);
          } catch (error) {
            console.log(`Button not found or could not be clicked on ${site.url}:`, error);
            break; // Exit if button is not found or cannot be clicked
          }
        }
      }

      // After attempting to load more listings, retrieve the page text
      const pageText = await driver.findElement(By.css('body')).getText();

      // Filter lines containing 'intern' and collect them
      const internLines = pageText
        .split('\n')
        .filter(line => (line.toLowerCase().includes('intern')) || line.toLowerCase().includes('summer'));

      // Add the intern lines to the company's job listings
      companyJobListings.push(...internLines);

      // Store the job listings in the dictionary with the company name
      jobOpenings[site.companyName] = companyJobListings;

    } catch (error) {
      console.log(`Error processing ${site.url}:`, error);
    }
  }

  // Log the final job openings dictionary
  console.log("Job Openings by Company:");
  console.log(jobOpenings);

  await driver.quit();
})();
