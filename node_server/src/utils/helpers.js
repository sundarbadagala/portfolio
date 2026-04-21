//convert html tags content into plan text
function stripHTMLTags(str) {
  return str.replace(/<[^>]*>/g, " ").slice(0,150); 
}

module.exports = { stripHTMLTags };
