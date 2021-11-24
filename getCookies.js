const puppeteer = require("puppeteer");
const fs = require("fs");
let urls = ["https://hunter.io/", "https://secure.clearbooks.co.uk/"];
const crawlFrom = async (urls) => {
	const launchOptions = {
		// Set viewport size
		defaultViewport: { width: 1920, height: 1080 },
		// Set window size
		args: ["--window-size=1920,1080"],
		// Disable headless mode for debugging
		headless: false,
	};
	const browser = await puppeteer.launch(launchOptions);

	for (let i = 0; i < urls.length; i++) {
		try {
			const url = urls[i];
			const page = await browser.newPage();
			await page.setViewport({ width: 1440, height: 1080 });
			const fileName = Buffer.from(`${url}`).toString("base64");
			const cookiesFilePath = `${fileName}.json`;
			await page.goto(`${url}`, { waitUntil: "networkidle0" });
			await page.waitForTimeout(30000);
			const cookiesObject = await page.cookies();
			fs.writeFile(
				cookiesFilePath,
				JSON.stringify(cookiesObject, null, 2),
				"utf8",
				(err) => {
					if (err) {
						console.log("The file could not be written.", err);
					}
					console.log("Session has been successfully saved");
				}
			);
		} catch (err) {
			console.log(err);
		}
	}

	await browser.close();
};
crawlFrom(urls);
