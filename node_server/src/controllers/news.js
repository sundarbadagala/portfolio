const axios = require("axios");

async function getNews(req, res) {
  try {
    const response = await axios.get("https://gnews.io/api/v4/top-headlines", {
      params: {
        category: "technology",
        lang: "en",
        country: "in",
        max: 5,
        apikey: process.env.GNEWS_API_KEY
      }
    });

    res.json({
      data: response.data.articles,
      success: "success",
      message: ""
    });
  } catch (err) {
    console.log('----', err)
    res.status(500).json({ error: "Failed to fetch news" });
  }
}

module.exports = { getNews };
