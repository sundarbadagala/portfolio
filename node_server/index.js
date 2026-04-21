const app = require("./src/app");
const db = require("./db");
require("dotenv").config();

db();

const port = process.env.PORT || 8080;

app.listen(port, () =>
  console.log(`\x1b[36mServer running at: http://localhost:${port}\x1b[0m`)
);
