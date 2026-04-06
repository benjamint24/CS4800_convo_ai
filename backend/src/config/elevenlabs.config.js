/**
 * ElevenLabs Service Configuration
 * 
 * Centralized configuration for ElevenLabs TTS and STT integration.
 */

require('dotenv').config();

const elevenlabsConfig = {
  // API authentication
  apiKey: process.env.ELEVENLABS_API_KEY,

  // Base URL
  baseUrl: 'https://api.elevenlabs.io',

  // Default voice — "Rachel" (supports multilingual, sounds natural in Spanish)
  defaultVoiceId: '21m00Tcm4TlvDq8ikWAM',

  // TTS configuration
  tts: {
    model: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
    voiceSettings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    }
  },

  // STT configuration (Scribe)
  stt: {
    model: 'scribe_v1',
    languageCode: 'spa'  // Spanish
  },

  // Timeout
  timeout: {
    requestMs: 30000
  }
};

// Validate critical configuration on module load
if (!elevenlabsConfig.apiKey) {
  console.warn('[ElevenLabs Config] ELEVENLABS_API_KEY not set — voice features will be disabled');
}

module.exports = elevenlabsConfig;
