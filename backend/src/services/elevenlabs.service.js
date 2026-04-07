<<<<<<< Updated upstream
/**
 * ElevenLabs Service
 * 
 * Provides text-to-speech and speech-to-text functionality
 * using the ElevenLabs API.
 */

const elevenlabsConfig = require('../config/elevenlabs.config');

/**
 * Convert text to speech using ElevenLabs TTS API
 * 
 * @param {string} text - The text to synthesize
 * @param {string} [voiceId] - Optional voice ID override
 * @returns {Promise<Buffer>} Audio buffer (MP3)
 */
=======
const elevenlabsConfig = require('../config/elevenlabs.config');

>>>>>>> Stashed changes
async function synthesizeSpeech(text, voiceId) {
  if (!elevenlabsConfig.apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text must be a non-empty string');
  }

  const selectedVoiceId = voiceId || elevenlabsConfig.defaultVoiceId;
  const url = `${elevenlabsConfig.baseUrl}/v1/text-to-speech/${selectedVoiceId}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), elevenlabsConfig.timeout.requestMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
<<<<<<< Updated upstream
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsConfig.apiKey
=======
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsConfig.apiKey,
>>>>>>> Stashed changes
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: elevenlabsConfig.tts.model,
<<<<<<< Updated upstream
        voice_settings: elevenlabsConfig.tts.voiceSettings
      }),
      signal: controller.signal
=======
        voice_settings: elevenlabsConfig.tts.voiceSettings,
      }),
      signal: controller.signal,
>>>>>>> Stashed changes
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      let errorDetail;
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
      try {
        errorDetail = JSON.parse(errorBody);
      } catch {
        errorDetail = { error: errorBody };
      }
<<<<<<< Updated upstream
      throw new Error(`ElevenLabs TTS error (${response.status}): ${JSON.stringify(errorDetail)}`);
    }

    // Get audio as ArrayBuffer then convert to Buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);

=======

      throw new Error(`ElevenLabs TTS error (${response.status}): ${JSON.stringify(errorDetail)}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
>>>>>>> Stashed changes
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(`ElevenLabs TTS request timed out after ${elevenlabsConfig.timeout.requestMs}ms`);
    }

    throw error;
  }
}

<<<<<<< Updated upstream
/**
 * Convert speech to text using ElevenLabs STT API (Scribe)
 * 
 * @param {Buffer} audioBuffer - Audio data buffer
 * @param {string} [filename='audio.webm'] - Original filename for content type detection
 * @returns {Promise<string>} Transcribed text
 */
=======
>>>>>>> Stashed changes
async function transcribeSpeech(audioBuffer, filename = 'audio.webm') {
  if (!elevenlabsConfig.apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('Audio buffer is required');
  }

  const url = `${elevenlabsConfig.baseUrl}/v1/speech-to-text`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), elevenlabsConfig.timeout.requestMs);

  try {
<<<<<<< Updated upstream
    // Use Node.js native FormData (available in Node 18+)
=======
>>>>>>> Stashed changes
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/webm' });
    formData.append('file', blob, filename);
    formData.append('model_id', elevenlabsConfig.stt.model);
    formData.append('language_code', elevenlabsConfig.stt.languageCode);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
<<<<<<< Updated upstream
        'xi-api-key': elevenlabsConfig.apiKey
      },
      body: formData,
      signal: controller.signal
=======
        'xi-api-key': elevenlabsConfig.apiKey,
      },
      body: formData,
      signal: controller.signal,
>>>>>>> Stashed changes
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      let errorDetail;
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
      try {
        errorDetail = JSON.parse(errorBody);
      } catch {
        errorDetail = { error: errorBody };
      }
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
      throw new Error(`ElevenLabs STT error (${response.status}): ${JSON.stringify(errorDetail)}`);
    }

    const result = await response.json();
<<<<<<< Updated upstream

    // The Scribe API returns { text: "..." } or { language_code, text, ... }
    return result.text || '';

=======
    return result.text || '';
>>>>>>> Stashed changes
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(`ElevenLabs STT request timed out after ${elevenlabsConfig.timeout.requestMs}ms`);
    }

    throw error;
  }
}

module.exports = {
  synthesizeSpeech,
<<<<<<< Updated upstream
  transcribeSpeech
};
=======
  transcribeSpeech,
};
>>>>>>> Stashed changes
