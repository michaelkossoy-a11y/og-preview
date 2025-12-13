import fetch from "node-fetch";

export default async function handler(req, res) {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: "url is required" });
    }

    const BQL_API = "https://api.browserql.com/graphql"; // пример, уточните у BrowserQL
    const BQL_KEY = "2TbE2q3dkWKQqGTf066f85752a82e1a091c73caa67107a45c"; // вставьте свой ключ

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
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}