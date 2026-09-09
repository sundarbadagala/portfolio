const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

/**
 * Perform web search using available search providers
 * Priority: Tavily > Serper > GNews > DuckDuckGo
 * @param {string} query
 * @param {number} maxResults
 * @returns {Promise<Array<{title: string, url: string, content: string}>>}
 */
async function searchWeb(query, maxResults = 5) {
  if (!query || typeof query !== "string") return [];
  const cleanQuery = query.trim();

  // 1. Tavily Search API
  if (process.env.TAVILY_API_KEY) {
    try {
      const response = await axios.post(
        "https://api.tavily.com/search",
        {
          api_key: process.env.TAVILY_API_KEY,
          query: cleanQuery,
          search_depth: "basic",
          max_results: maxResults,
        },
        { timeout: 8000 }
      );
      if (response.data?.results?.length > 0) {
        return response.data.results.map((r) => ({
          title: r.title || "Web Result",
          url: r.url || "",
          content: r.content || "",
        }));
      }
    } catch (err) {
      console.warn("Tavily search error:", err.message);
    }
  }

  // 2. Serper Google Search API
  if (process.env.SERPER_API_KEY) {
    try {
      const response = await axios.post(
        "https://google.serper.dev/search",
        { q: cleanQuery, num: maxResults },
        {
          headers: {
            "X-API-KEY": process.env.SERPER_API_KEY,
            "Content-Type": "application/json",
          },
          timeout: 8000,
        }
      );
      if (response.data?.organic?.length > 0) {
        return response.data.organic.map((r) => ({
          title: r.title || "Web Result",
          url: r.link || "",
          content: r.snippet || "",
        }));
      }
    } catch (err) {
      console.warn("Serper search error:", err.message);
    }
  }

  // 3. GNews API (if query looks like news or recent job market updates)
  if (process.env.GNEWS_API_KEY) {
    try {
      const response = await axios.get("https://gnews.io/api/v4/search", {
        params: {
          q: cleanQuery,
          token: process.env.GNEWS_API_KEY,
          max: maxResults,
          lang: "en",
        },
        timeout: 6000,
      });
      if (response.data?.articles?.length > 0) {
        return response.data.articles.map((a) => ({
          title: a.title || "News Result",
          url: a.url || "",
          content: a.description || a.content || "",
        }));
      }
    } catch (err) {
      console.warn("GNews search error:", err.message);
    }
  }

  // 4. DuckDuckGo Instant Answer / HTML Search
  try {
    const ddgResponse = await axios.get("https://api.duckduckgo.com/", {
      params: {
        q: cleanQuery,
        format: "json",
        no_html: "1",
        skip_disambig: "1",
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      timeout: 6000,
    });

    const data = ddgResponse.data;
    const results = [];

    if (data.AbstractText) {
      results.push({
        title: data.Heading || cleanQuery,
        url: data.AbstractURL || "https://duckduckgo.com/?q=" + encodeURIComponent(cleanQuery),
        content: data.AbstractText,
      });
    }

    if (Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics) {
        if (topic.Text && topic.FirstURL && results.length < maxResults) {
          results.push({
            title: topic.Text.split(" - ")[0] || "Related Result",
            url: topic.FirstURL,
            content: topic.Text,
          });
        }
      }
    }

    if (results.length > 0) {
      return results;
    }
  } catch (err) {
    console.warn("DDG API search error:", err.message);
  }

  // Fallback: Return curated relevant portal direct links for the query
  const encoded = encodeURIComponent(cleanQuery);
  return [
    {
      title: `LinkedIn Jobs: ${cleanQuery}`,
      url: `https://www.linkedin.com/jobs/search/?keywords=${encoded}`,
      content: `Live job listings and openings on LinkedIn for "${cleanQuery}".`,
    },
    {
      title: `Naukri / Indeed / Wellfound Jobs: ${cleanQuery}`,
      url: `https://www.google.com/search?q=${encoded}+jobs+active+hiring`,
      content: `Active hiring postings and openings across top tech job portals for "${cleanQuery}".`,
    },
  ];
}

/**
 * LangChain Tool definition for Web Search
 */
const webSearchTool = tool(
  async ({ query }) => {
    try {
      const results = await searchWeb(query, 5);
      if (!results || results.length === 0) {
        return "No web results found for this search query.";
      }
      return JSON.stringify(results, null, 2);
    } catch (error) {
      return `Failed to execute web search: ${error.message}`;
    }
  },
  {
    name: "web_search",
    description:
      "Search the web for real-time information, recent events, active job openings, current company news, documentation, or any data requiring live web information.",
    schema: z.object({
      query: z
        .string()
        .describe("The search query keywords to look up on the web"),
    }),
  }
);

module.exports = {
  searchWeb,
  webSearchTool,
};
