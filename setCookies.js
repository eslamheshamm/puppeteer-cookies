const puppeteer = require("puppeteer");
const fs = require("fs");

let urls = ["https://hunter.io/", "https://secure.clearbooks.co.uk/"];

const crawlForm = async (url) => {
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
			const previousSession = fs.existsSync(cookiesFilePath);
			if (previousSession) {
				const cookiesString = fs.readFileSync(cookiesFilePath);
				const parsedCookies = JSON.parse(cookiesString);
				if (parsedCookies.length !== 0) {
					for (let cookie of parsedCookies) {
						await page.setCookie(cookie);
					}
					console.log("Session has been loaded in the browser");
				} else {
					console.log("Session failed");
				}
			}
			await page.goto(`${url}`, { waitUntil: "networkidle0" });
			await page.waitForTimeout(10000);
		} catch (err) {
			console.log(err);
		}
	}

	await browser.close();
};

crawlForm(urls);
