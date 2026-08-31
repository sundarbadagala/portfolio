const express = require("express");
const jwtCookieHandler = require("../middleware/jwtCookieHandler");
const {
  chat,
  getUserChatSessions,
  getChatSessionById,
  renameChatSession,
  deleteChatSession,
  clearAllChatSessions,
} = require("../controllers/chat");

const router = express.Router();

// Apply auth middleware to protect chat sessions
router.use(jwtCookieHandler);

router
  .route("/sessions")
  .get(getUserChatSessions)
  .delete(clearAllChatSessions);

router
  .route("/sessions/:sessionId")
  .get(getChatSessionById)
  .patch(renameChatSession)
  .put(renameChatSession)
  .delete(deleteChatSession);

router.route("/").post(chat);

module.exports = router;
