const axios = require("axios");
const NewsCache = require("../models/newsCache");

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

    const articles = response.data.articles;

    // Persist latest articles — keep only one document
    await NewsCache.findOneAndUpdate({}, { articles }, { upsert: true, new: true });

    return res.sendSuccess(articles);
  } catch (err) {
    const cached = await NewsCache.findOne({}).catch(() => null);
    if (cached) {
      return res.sendSuccess(cached.articles);
    }
    next(err);
  }
}

module.exports = { getNews };
