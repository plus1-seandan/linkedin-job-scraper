const {
  LinkedinScraper,
  relevanceFilter,
  timeFilter,
  typeFilter,
  experienceLevelFilter,
  events,
} = require("linkedin-jobs-scraper");
const fs = require("fs");

const scraper = async () => {
  // Each scraper instance is associated with one browser.
  // Concurrent queries will run on different pages within the same browser instance.
  const scraper = new LinkedinScraper({
    headless: true,
    slowMo: 100,
    args: ["--lang=en-GB"],
  });

  // Add listeners for scraper events
  scraper.on(events.scraper.data, (data) => {
    let rawdata = fs.readFileSync("jobs.json");
    let parsedJson = JSON.parse(rawdata);
    const result = {
      jobDescription: data.description.length,
      jobDescriptionHTML: data.descriptionHTML.length,
      query: `${data.query}`,
      location: `${data.location}`,
      id: `${data.jobId}`,
      title: `'${data.title}`,
      company: `${data.company ? data.company : "N/A"}`,
      place: `${data.place}`,
      date: `${data.date}`,
      link: `${data.link}`,
      applyLink: `${data.applyLink ? data.applyLink : "N/A"}`,
      senorityLevel: `${data.senorityLevel}`,
      jobFunction: `${data.jobFunction}`,
      employmentType: `${data.employmentType}`,
    };
    parsedJson.data.push(result);
    const backToJSON = JSON.stringify(parsedJson); //reserialize to JSON
    // console.log(_data);
    fs.writeFileSync("jobs.json", backToJSON);
  });

  scraper.on(events.scraper.error, (err) => {
    console.error(err);
  });

  scraper.on(events.scraper.end, () => {
    console.log("All done!");
  });

  // Add listeners for puppeteer browser events
  scraper.on(events.puppeteer.browser.targetcreated, () => {});
  scraper.on(events.puppeteer.browser.targetchanged, () => {});
  scraper.on(events.puppeteer.browser.targetdestroyed, () => {});
  scraper.on(events.puppeteer.browser.disconnected, () => {});

  // Custom function executed on browser side to extract job description
  const descriptionFn = () =>
    document
      .querySelector(".description__text")
      .innerText.replace(/[\s\n\r]+/g, " ")
      .trim();

  // Run queries concurrently
  await Promise.all([
    // Run queries serially
    scraper.run(
      [
        {
          query: "Software Engineer",
          options: {
            locations: ["Houston"],
            filters: {
              type: [typeFilter.FULL_TIME],
            },
            limit: 5, // This will override global option limit (33)
          },
        },
        // (type: [typeFilter.FULL_TIME, typeFilter.CONTRACT]),
        // {
        //   query: "Sales",
        //   options: {
        //     limit: 1, // This will override global option limit (33)
        //   },
        // },
      ]
      //   {
      //     // Global options for this run, will be merged individually with each query options (if any)
      //     locations: ["Europe"],
      //     optimize: true,
      //     limit: 1, // This will override global option limit (33)
      //   }
    ),
  ]);

  // Close browser
  await scraper.close();
};

module.exports = scraper;
