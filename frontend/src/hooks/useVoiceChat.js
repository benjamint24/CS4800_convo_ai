import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = "http://localhost:5050/api/voice";

export default function useVoiceChat() {
  const [recordingState, setRecordingState] = useState("idle");
  const [playingState, setPlayingState] = useState("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [playbackLevel, setPlaybackLevel] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const currentAudioRef = useRef(null);
  const playbackAnimationFrameRef = useRef(null);
  const playbackAudioContextRef = useRef(null);

  const getToken = () => localStorage.getItem("convoai_token");

  const stopAudioMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

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

        let sum = 0;
        for (let index = 0; index < dataArray.length; index += 1) {
          sum += dataArray[index];
        }

        setAudioLevel(sum / dataArray.length / 255);
        animationFrameRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch (error) {
      console.warn("Audio monitoring unavailable:", error);
    }
  }, []);

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm",
    });

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.start();
    setRecordingState("recording");
    startAudioMonitoring(stream);
  }, [startAudioMonitoring]);

  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        reject(new Error("No active recording"));
        return;
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        stopAudioMonitoring();
        setRecordingState("idle");
        resolve(audioBlob);
      };

      mediaRecorder.stop();
    });
  }, [stopAudioMonitoring]);

  const transcribeAudio = useCallback(async (audioBlob, language = "es") => {
    setRecordingState("transcribing");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", language);

      const response = await fetch(`${API_BASE}/transcribe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Transcription failed");
      }

      const data = await response.json();
      return data.transcription;
    } finally {
      setRecordingState("idle");
    }
  }, []);

  const stopPlayback = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    if (playbackAnimationFrameRef.current) {
      cancelAnimationFrame(playbackAnimationFrameRef.current);
      playbackAnimationFrameRef.current = null;
    }

    if (playbackAudioContextRef.current) {
      playbackAudioContextRef.current.close().catch(() => {});
      playbackAudioContextRef.current = null;
    }

    setPlaybackLevel(0);
    setPlayingState("idle");
  }, []);

  const playAudio = useCallback(async (text) => {
    stopPlayback();
    setPlayingState("loading");

    const response = await fetch(`${API_BASE}/synthesize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Speech synthesis failed");
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    playbackAudioContextRef.current = audioContext;
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const monitorPlayback = () => {
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let index = 0; index < dataArray.length; index += 1) {
        sum += dataArray[index];
      }

      setPlaybackLevel(sum / dataArray.length / 255);
      playbackAnimationFrameRef.current = requestAnimationFrame(monitorPlayback);
    };

    setPlayingState("playing");
    monitorPlayback();

    await new Promise((resolve, reject) => {
      audio.onended = () => {
        stopPlayback();
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      audio.onerror = () => {
        stopPlayback();
        URL.revokeObjectURL(audioUrl);
        reject(new Error("Audio playback failed"));
      };

      audio.play().catch(reject);
    });
  }, [stopPlayback]);

  useEffect(() => {
    return () => {
      stopAudioMonitoring();
      stopPlayback();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [stopAudioMonitoring, stopPlayback]);

  return {
    recordingState,
    playingState,
    audioLevel,
    playbackLevel,
    isRecording: recordingState === "recording",
    isTranscribing: recordingState === "transcribing",
    isPlaying: playingState === "playing",
    isLoadingAudio: playingState === "loading",
    startRecording,
    stopRecording,
    transcribeAudio,
    playAudio,
    stopPlayback,
  };
}
