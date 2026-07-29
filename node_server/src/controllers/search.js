const { performRAGSearch } = require('../utils/rag')


/**
 * @desc Express controller to handle GET /api/v1/search?q=
 * @path GET /api/v1/search?q=
 * @access public
 */
async function ragSearchContent(req, res, next) {
  try {
    const queryText = (req.query.q || req.query.query || "").trim();

    if (!queryText) {
      res.status(400);
      throw new Error("Search query parameter 'q' is required");
    }

    const searchResults = await performRAGSearch(queryText);
    return res.sendSuccess(searchResults, "Content list retrieved via RAG search");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  ragSearchContent
};
