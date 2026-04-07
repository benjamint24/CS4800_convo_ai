import { useState, useRef, useCallback } from 'react';

const API_BASE = 'http://localhost:5050/api/voice';

/**
 * Custom hook for voice chat functionality.
 * Handles microphone recording, transcription, and speech synthesis.
 */
export default function useVoiceChat() {
  const [recordingState, setRecordingState] = useState('idle'); // idle | recording | transcribing
  const [playingState, setPlayingState] = useState('idle'); // idle | loading | playing
  const [audioLevel, setAudioLevel] = useState(0);
  const [playbackLevel, setPlaybackLevel] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const currentAudioRef = useRef(null);
  const playbackAnalyserRef = useRef(null);
  const playbackAnimFrameRef = useRef(null);

  const getToken = () => localStorage.getItem('convoai_token');

  // Monitor microphone audio level for visualization
  const startAudioMonitoring = useCallback((stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        // Calculate average volume (0-1)
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length / 255;
        setAudioLevel(avg);
        animFrameRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch (err) {
      console.warn('Audio monitoring unavailable:', err);
    }
  }, []);

  const stopAudioMonitoring = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  // Start recording from microphone
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(); // Collect data only when stopped to ensure valid WebM header
      setRecordingState('recording');
      startAudioMonitoring(stream);

    } catch (err) {
      console.error('Failed to start recording:', err);
      throw new Error('Microphone access denied. Please allow microphone permissions.');
    }
  }, [startAudioMonitoring]);

  // Stop recording and return the audio blob
  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        stopAudioMonitoring();

        resolve(audioBlob);
      };

      mediaRecorder.stop();
    });
  }, [stopAudioMonitoring]);

  // Transcribe audio blob via backend
  const transcribeAudio = useCallback(async (audioBlob) => {
    setRecordingState('transcribing');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(`${API_BASE}/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Transcription failed');
      }

      const data = await response.json();
      return data.transcription;

    } finally {
      setRecordingState('idle');
    }
  }, []);

  // Synthesize and play speech
  const playAudio = useCallback(async (text) => {
    // Stop any current playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (playbackAnimFrameRef.current) {
      cancelAnimationFrame(playbackAnimFrameRef.current);
    }

    setPlayingState('loading');

    try {
      const response = await fetch(`${API_BASE}/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Speech synthesis failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      // Set up playback level monitoring
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audio);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      playbackAnalyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const monitorPlayback = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length / 255;
        setPlaybackLevel(avg);
        playbackAnimFrameRef.current = requestAnimationFrame(monitorPlayback);
      };

      setPlayingState('playing');
      monitorPlayback();

      await new Promise((resolve, reject) => {
        audio.onended = () => {
          cancelAnimationFrame(playbackAnimFrameRef.current);
          setPlaybackLevel(0);
          setPlayingState('idle');
          audioContext.close().catch(() => {});
          URL.revokeObjectURL(audioUrl);
          currentAudioRef.current = null;
          resolve();
        };
        audio.onerror = (e) => {
          cancelAnimationFrame(playbackAnimFrameRef.current);
          setPlaybackLevel(0);
          setPlayingState('idle');
          audioContext.close().catch(() => {});
          URL.revokeObjectURL(audioUrl);
          currentAudioRef.current = null;
          reject(new Error('Audio playback failed'));
        };
        audio.play().catch(reject);
      });

    } catch (error) {
      setPlayingState('idle');
      setPlaybackLevel(0);
      throw error;
    }
  }, []);

  // Stop current playback
  const stopPlayback = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (playbackAnimFrameRef.current) {
      cancelAnimationFrame(playbackAnimFrameRef.current);
    }
    setPlaybackLevel(0);
    setPlayingState('idle');
  }, []);

  return {
    // State
    recordingState,
    playingState,
    audioLevel,      // 0-1, microphone input level
    playbackLevel,   // 0-1, audio playback level

    // Actions
    startRecording,
    stopRecording,
    transcribeAudio,
    playAudio,
    stopPlayback,

    // Derived
    isRecording: recordingState === 'recording',
    isTranscribing: recordingState === 'transcribing',
    isPlaying: playingState === 'playing',
    isLoadingAudio: playingState === 'loading'
  };
}
