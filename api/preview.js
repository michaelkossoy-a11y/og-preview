import { chromium } from 'playwright';

export default async function handler(req, res) {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'url is required' });
    }

    const browser = await chromium.launch();
    const page = await browser.newPage({
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
    });

    try {
        await page.goto(url, {
            waitUntil: 'networkidle',
            timeout: 30000,
        });

        const og = await page.evaluate(() => {
            const get = (p) =>
                document.querySelector(`meta[property="${p}"]`)?.content || '';

            return {
                title: get('og:title'),
                description: get('og:description'),
                image: get('og:image'),
                url: get('og:url'),
            };
        });

        await browser.close();
        res.status(200).json(og);
    } catch (e) {
        await browser.close();
        res.status(500).json({ error: e.message });
    }
}