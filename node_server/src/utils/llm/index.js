const { model: openrouterModel } = require("./openrouter");
const { model: geminiModel } = require("./gemini");

const model = openrouterModel.withFallbacks({
  fallbacks: [geminiModel]
});

module.exports = {
  model,
  openrouterModel,
  geminiModel
};
