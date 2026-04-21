const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const logHandler = require("./middleware/logHandler");
const notFoundHandler = require("./middleware/notFoundHandler");
const user = require("./routes/user");
const content = require("./routes/content");
const tags = require("./routes/tags");
const query = require("./routes/query");
const upload = require("./routes/upload");
const news = require("./routes/news");
const qot = require("./routes/qot");
const $readme = require("./ejs/readme");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

app.use(logHandler);
app.use("/api/v1/user", user);
app.use("/api/v1/content", content);
app.use("/api/v1/tags", tags);
app.use("/api/v1/query", query);
app.use("/api/v1/upload", upload);
app.use("/api/v1/news", news);
app.use("/api/v1/qot", qot);

app.set("view engine", "ejs");
app.set("views", "views");
app.use("/readme", $readme);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
