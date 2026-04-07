<<<<<<< Updated upstream
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
=======
const { synthesizeSpeech, transcribeSpeech } = require('../services/elevenlabs.service');

>>>>>>> Stashed changes
exports.synthesize = async (req, res) => {
  try {
    const { text, voiceId } = req.body || {};

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
<<<<<<< Updated upstream
        message: 'Field "text" is required and must be a non-empty string'
=======
        message: 'Field "text" is required and must be a non-empty string',
>>>>>>> Stashed changes
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
<<<<<<< Updated upstream
        message: 'Field "text" must be <= 5000 characters'
      });
    }

    console.log(`[Voice Controller] Synthesizing ${text.length} chars`);

=======
        message: 'Field "text" must be <= 5000 characters',
      });
    }

>>>>>>> Stashed changes
    const audioBuffer = await synthesizeSpeech(text.trim(), voiceId);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
<<<<<<< Updated upstream
      'Cache-Control': 'no-cache'
    });

    return res.send(audioBuffer);

=======
      'Cache-Control': 'no-cache',
    });

    return res.send(audioBuffer);
>>>>>>> Stashed changes
  } catch (error) {
    console.error('[Voice Controller] Synthesis failed:', error.message);
    return res.status(500).json({
      error: 'VOICE_SYNTHESIS_ERROR',
<<<<<<< Updated upstream
      message: error.message
=======
      message: error.message,
>>>>>>> Stashed changes
    });
  }
};

<<<<<<< Updated upstream
/**
 * POST /api/voice/transcribe
 * Body: multipart/form-data with 'audio' file field
 * Returns: { transcription: string }
 */
=======
>>>>>>> Stashed changes
exports.transcribe = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
<<<<<<< Updated upstream
        message: 'Audio file is required (field name: "audio")'
=======
        message: 'Audio file is required (field name: "audio")',
>>>>>>> Stashed changes
      });
    }

    const audioBuffer = req.file.buffer;
    const filename = req.file.originalname || 'audio.webm';

    if (audioBuffer.length === 0) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
<<<<<<< Updated upstream
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

=======
        message: 'Audio file is empty',
      });
    }

    if (audioBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Audio file must be <= 10MB',
      });
    }

>>>>>>> Stashed changes
    const transcription = await transcribeSpeech(audioBuffer, filename);

    return res.status(200).json({
      transcription,
<<<<<<< Updated upstream
      timestamp: new Date().toISOString()
    });

=======
      timestamp: new Date().toISOString(),
    });
>>>>>>> Stashed changes
  } catch (error) {
    console.error('[Voice Controller] Transcription failed:', error.message);
    return res.status(500).json({
      error: 'VOICE_TRANSCRIPTION_ERROR',
<<<<<<< Updated upstream
      message: error.message
    });
  }
};
=======
      message: error.message,
    });
  }
};
>>>>>>> Stashed changes
