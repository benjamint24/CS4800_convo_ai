const { synthesizeSpeech, transcribeSpeech } = require('../services/elevenlabs.service');

const SUPPORTED_LANGUAGES = {
  en: 'eng',
  es: 'spa',
  zh: 'zho',
  ko: 'kor',
  ja: 'jpn'
};

const SUPPORTED_LANGUAGE_KEYS = Object.keys(SUPPORTED_LANGUAGES);

exports.synthesize = async (req, res) => {
  try {
    const { text, voiceId } = req.body || {};

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Field "text" is required and must be a non-empty string',
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Field "text" must be <= 5000 characters',
      });
    }

    const audioBuffer = await synthesizeSpeech(text.trim(), voiceId);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'no-cache',
    });

    return res.send(audioBuffer);
  } catch (error) {
    console.error('[Voice Controller] Synthesis failed:', error.message);
    return res.status(500).json({
      error: 'VOICE_SYNTHESIS_ERROR',
      message: error.message,
    });
  }
};

exports.transcribe = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Audio file is required (field name: "audio")',
      });
    }

    const audioBuffer = req.file.buffer;
    const filename = req.file.originalname || 'audio.webm';
    const requestedLanguage = typeof req.body?.language === 'string' ? req.body.language.trim().toLowerCase() : 'es';

    if (!SUPPORTED_LANGUAGE_KEYS.includes(requestedLanguage)) {
      return res.status(400).json({
        error: 'INVALID_LANGUAGE',
        message: `Language "${requestedLanguage}" is not supported. Use one of: ${SUPPORTED_LANGUAGE_KEYS.join(', ')}`,
      });
    }

    const languageCode = SUPPORTED_LANGUAGES[requestedLanguage];

    if (audioBuffer.length === 0) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Audio file is empty',
      });
    }

    if (audioBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        error: 'VOICE_VALIDATION_ERROR',
        message: 'Audio file must be <= 10MB',
      });
    }

    const transcription = await transcribeSpeech(audioBuffer, filename, languageCode);

    return res.status(200).json({
      transcription,
      language: requestedLanguage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Voice Controller] Transcription failed:', error.message);
    return res.status(500).json({
      error: 'VOICE_TRANSCRIPTION_ERROR',
      message: error.message,
    });
  }
};
