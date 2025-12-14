
//2TbE2q3dkWKQqGTf066f85752a82e1a091c73caa67107a45c

export default async function handler(req, res) {
    const url = req.query.url;

    if (!url) {
        // Нет URL — просто сообщение
        return res.status(200).json({ message: "Ready to work, send me a URL" });
    }

    // Ваш ключ BrowserQL
    const BQL_KEY = "2TbE2q3dkWKQqGTf066f85752a82e1a091c73caa67107a45c";

    // Правильный endpoint с токеном
    const BQL_API = `https://production-sfo.browserless.io/chromium/bql?token=${BQL_KEY}`;

    // GraphQL-запрос к BrowserQL
    const query = `
    mutation ScrapePage {
      goto(url: "${url}", waitUntil: firstMeaningfulPaint) {
        status
        time
      }
      ogTitle: attribute(selector: "meta[property='og:title']", name: "content")
      ogDescription: attribute(selector: "meta[property='og:description']", name: "content")
      ogImage: attribute(selector: "meta[property='og:image']", name: "content")
      ogUrl: attribute(selector: "meta[property='og:url']", name: "content")
    }
  `;

    try {
        const response = await fetch(BQL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        // Возвращаем OG-теги и URL, который мы получили
        return res.status(200).json({
            message: "BrowserQL processed the URL",
            receivedUrl: url,
            ogData: data
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}



/* import fetch from "node-fetch";

export default async function handler(req, res) {
    const url = req.query.url;

    if (!url) {
        // Нет url — просто сообщение, без вызова BrowserQL
        return res.status(200).json({ message: "Ready to work, send me a URL" });
    }

    // Если url есть — вызываем BrowserQL
    const BQL_KEY = "ВАШ_BROWSERQL_API_KEY";
    const BQL_API = "https://api.browserql.com/graphql";

    const query = `
    mutation ScrapePage {
      goto(url: "${url}", waitUntil: firstMeaningfulPaint) {
        status
        time
      }
      ogTitle: attribute(selector: "meta[property='og:title']", name: "content")
      ogDescription: attribute(selector: "meta[property='og:description']", name: "content")
      ogImage: attribute(selector: "meta[property='og:image']", name: "content")
      ogUrl: attribute(selector: "meta[property='og:url']", name: "content")
    }
  `;

    try {
        const response = await fetch(BQL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BQL_KEY}`,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
} */
