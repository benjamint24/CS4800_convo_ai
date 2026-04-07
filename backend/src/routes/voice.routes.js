const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");
const voiceController = require("../controllers/voice.controller");

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// POST /api/voice/synthesize — text to speech
router.post("/synthesize", authMiddleware, voiceController.synthesize);

// POST /api/voice/transcribe — speech to text
router.post("/transcribe", authMiddleware, upload.single("audio"), voiceController.transcribe);

module.exports = router;
