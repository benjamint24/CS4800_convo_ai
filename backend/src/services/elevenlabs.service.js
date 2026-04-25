const elevenlabsConfig = require('../config/elevenlabs.config');

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
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsConfig.apiKey,
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: elevenlabsConfig.tts.model,
        voice_settings: elevenlabsConfig.tts.voiceSettings,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      let errorDetail;

      try {
        errorDetail = JSON.parse(errorBody);
      } catch {
        errorDetail = { error: errorBody };
      }

      throw new Error(`ElevenLabs TTS error (${response.status}): ${JSON.stringify(errorDetail)}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(`ElevenLabs TTS request timed out after ${elevenlabsConfig.timeout.requestMs}ms`);
    }

    throw error;
  }
}

async function transcribeSpeech(audioBuffer, filename = 'audio.webm', languageCode = elevenlabsConfig.stt.languageCode) {
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
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/webm' });
    formData.append('file', blob, filename);
    formData.append('model_id', elevenlabsConfig.stt.model);
    formData.append('language_code', languageCode);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenlabsConfig.apiKey,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      let errorDetail;

      try {
        errorDetail = JSON.parse(errorBody);
      } catch {
        errorDetail = { error: errorBody };
      }

      throw new Error(`ElevenLabs STT error (${response.status}): ${JSON.stringify(errorDetail)}`);
    }

    const result = await response.json();
    return result.text || '';
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
  transcribeSpeech,
};
