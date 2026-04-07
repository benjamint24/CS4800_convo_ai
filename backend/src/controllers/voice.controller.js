/**
 * Voice Controller
 * 
 * Handles text-to-speech synthesis and speech-to-text transcription
 * requests via ElevenLabs API.
 */

const { synthesizeSpeech, transcribeSpeech } = require('../services/elevenlabs.service');

/**
 * POST /api/voice/synthesize
 * Body: { text: string, voiceId?: string }
 * Returns: audio/mpeg binary stream
 */
exports.synthesize = async (req, res) => {
  try {
    const { text, voiceId } = req.body || {};

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Field "text" is required and must be a non-empty string'
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Field "text" must be <= 5000 characters'
      });
    }

    console.log(`[Voice Controller] Synthesizing ${text.length} chars`);

    const audioBuffer = await synthesizeSpeech(text.trim(), voiceId);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'no-cache'
    });

    return res.send(audioBuffer);

  } catch (error) {
    console.error('[Voice Controller] Synthesis failed:', error.message);
    return res.status(500).json({
      error: 'VOICE_SYNTHESIS_ERROR',
      message: error.message
    });
  }
};

/**
 * POST /api/voice/transcribe
 * Body: multipart/form-data with 'audio' file field
 * Returns: { transcription: string }
 */
exports.transcribe = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Audio file is required (field name: "audio")'
      });
    }

    const audioBuffer = req.file.buffer;
    const filename = req.file.originalname || 'audio.webm';

    if (audioBuffer.length === 0) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Audio file is empty'
      });
    }

    // 10MB limit
    if (audioBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Audio file must be <= 10MB'
      });
    }

    console.log(`[Voice Controller] Transcribing ${(audioBuffer.length / 1024).toFixed(1)}KB audio`);

    const transcription = await transcribeSpeech(audioBuffer, filename);

    return res.status(200).json({
      transcription,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Voice Controller] Transcription failed:', error.message);
    return res.status(500).json({
      error: 'VOICE_TRANSCRIPTION_ERROR',
      message: error.message
    });
  }
};
