// Convert HTML tags content into plain text without truncating
function stripHTMLTags(str) {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

module.exports = { stripHTMLTags };
