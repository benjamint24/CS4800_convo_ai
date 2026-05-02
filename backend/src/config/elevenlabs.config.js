require('dotenv').config();

const elevenlabsConfig = {
  apiKey: process.env.ELEVENLABS_API_KEY,
  baseUrl: 'https://api.elevenlabs.io',
  defaultVoiceId: '21m00Tcm4TlvDq8ikWAM',
  tts: {
    model: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
    voiceSettings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
    },
  },
  stt: {
    model: 'scribe_v1',
    languageCode: 'spa',
  },
  timeout: {
    requestMs: 30000,
  },
};

if (!elevenlabsConfig.apiKey) {
  console.warn('[ElevenLabs Config] ELEVENLABS_API_KEY not set - voice features will be disabled');
}

module.exports = elevenlabsConfig;
