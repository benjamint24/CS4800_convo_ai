const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const chatController = require("../controllers/chat.controller");

router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: "Chat route is protected and ready",
    userId: req.userId,
  });
});

router.post("/", authMiddleware, chatController.createConversationReply);

module.exports = router;