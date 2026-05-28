const axios = require("axios");

async function getNews(req, res, next) {
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
    return res.sendSuccess(response.data.articles);
  } catch (err) {
    next(err);
  }
}

module.exports = { getNews };
