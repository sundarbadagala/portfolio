const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const responseHandler = require("./middleware/responseHandler");
const logHandler = require("./middleware/logHandler");
const notFoundHandler = require("./middleware/notFoundHandler");
const user = require("./routes/user");
const content = require("./routes/content");
const tags = require("./routes/tags");
const query = require("./routes/query");
const upload = require("./routes/upload");
const news = require("./routes/news");
const qot = require("./routes/qot");
const chat = require("./routes/chat");
const rag = require('./routes/rag')
const search = require("./routes/search");
const qanda = require("./routes/qanda");
const auth = require("./routes/auth");
const $readme = require("./ejs/readme");

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"]
}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ type: ["application/json", "text/plain"] }));
app.use(cookieParser());

app.use(logHandler);
app.use(responseHandler);

app.get("/api/v1/dummy", (req, res) => {
  res.json("hello world");
});
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/content", content);
app.use("/api/v1/query", query);
app.use("/api/v1/upload", upload);
app.use("/api/v1/news", news);
app.use("/api/v1/filters", tags);
app.use("/api/v1/qot", qot);
app.use("/api/v1/chat", chat);
app.use("/api/v1/rag", rag)
app.use("/api/v1/search", search);
app.use("/api/v1/qanda", qanda);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/readme", $readme);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
