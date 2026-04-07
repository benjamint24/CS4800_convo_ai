<<<<<<< Updated upstream
import { useState, useRef, useEffect } from "react";
import VoiceOrb from "../components/VoiceOrb";
import useVoiceChat from "../hooks/useVoiceChat";
import "./Chat.css";
=======
import { useEffect, useRef, useState } from "react";
import VoiceOrb from "../components/VoiceOrb";
import useVoiceChat from "../hooks/useVoiceChat";
>>>>>>> Stashed changes

function Chat() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
<<<<<<< Updated upstream
  const [voiceMode, setVoiceMode] = useState(true);
  const [orbState, setOrbState] = useState("idle");
  const messagesEndRef = useRef(null);
=======
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  const {
    audioLevel,
    playbackLevel,
    isRecording,
    isTranscribing,
    isPlaying,
    isLoadingAudio,
    startRecording,
    stopRecording,
    transcribeAudio,
    playAudio,
  } = useVoiceChat();
>>>>>>> Stashed changes

  const {
    audioLevel,
    playbackLevel,
    isRecording,
    isTranscribing,
    isPlaying,
    isLoadingAudio,
    startRecording,
    stopRecording,
    transcribeAudio,
    playAudio,
    stopPlayback,
  } = useVoiceChat();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

<<<<<<< Updated upstream
  // Sync orb state
  useEffect(() => {
    if (isRecording) setOrbState("listening");
    else if (isTranscribing) setOrbState("transcribing");
    else if (loading) setOrbState("thinking");
    else if (isPlaying || isLoadingAudio) setOrbState("speaking");
    else setOrbState("idle");
  }, [isRecording, isTranscribing, loading, isPlaying, isLoadingAudio]);

  // Get active audio level for the orb
  const getActiveAudioLevel = () => {
    if (isRecording) return audioLevel;
    if (isPlaying) return playbackLevel;
    return 0;
  };

  const sendMessage = async (messageText) => {
    const text = messageText || input;
=======
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchScenarios = async () => {
    try {
      const token = localStorage.getItem("convoai_token");
      const res = await fetch("http://localhost:5050/api/scenarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setScenarios(data.scenarios || []);
    } catch (err) {
      console.error("Failed to fetch scenarios:", err);
    }
  };

  const startScenario = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setMessages([]);
    setInput("");
    setError("");
  };

  const getActiveAudioLevel = () => {
    if (isRecording) return audioLevel;
    if (isPlaying || isLoadingAudio) return playbackLevel;
    return 0;
  };

  const getOrbState = () => {
    if (isRecording) return "listening";
    if (isTranscribing) return "transcribing";
    if (loading) return "thinking";
    if (isPlaying || isLoadingAudio) return "speaking";
    return "idle";
  };

  const sendMessage = async (messageText) => {
    const text = typeof messageText === "string" ? messageText : input;
>>>>>>> Stashed changes
    if (!text.trim()) return;

    setError("");
    setLoading(true);

    const token = localStorage.getItem("convoai_token");
<<<<<<< Updated upstream
    const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
=======
    const history = messages.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    }));
>>>>>>> Stashed changes

    try {
      const res = await fetch("http://localhost:5050/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          history: history,
          scenarioId: selectedScenario,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

<<<<<<< Updated upstream
      setMessages((prev) => [
        ...prev,
=======
      setMessages([
        ...messages,
>>>>>>> Stashed changes
        { role: "user", content: text },
        {
          role: "assistant",
          content: data.assistantMessage,
          translation: data.translation,
          showTranslation: false,
        },
      ]);

      setInput("");

      if (voiceEnabled && data.assistantMessage) {
        await playAudio(data.assistantMessage);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

<<<<<<< Updated upstream
  // Voice recording handlers
  const handleOrbMouseDown = async () => {
    if (!voiceMode) return;
    if (orbState !== "idle") return;
=======
  const handleOrbMouseDown = async () => {
    if (!voiceEnabled || selectedScenario === null || isRecording || loading) return;

>>>>>>> Stashed changes
    try {
      await startRecording();
    } catch (err) {
      setError(err.message);
    }
<<<<<<< Updated upstream
=======
  };

  const handleOrbMouseUp = async () => {
    if (!isRecording) return;

    try {
      const audioBlob = await stopRecording();
      const transcription = await transcribeAudio(audioBlob);

      if (transcription && transcription.trim()) {
        setInput(transcription);
        await sendMessage(transcription);
      } else {
        setError("Could not understand the audio. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSpeakMessage = async (text) => {
    try {
      await playAudio(text);
    } catch (err) {
      setError(err.message);
    }
  };

  const getScenarioEmoji = (scenarioId) => {
    const emojis = { restaurant: "🍽️", travel: "🗺️", smallTalk: "💬" };
    return emojis[scenarioId] || "💬";
>>>>>>> Stashed changes
  };

  const handleOrbMouseUp = async () => {
    if (!isRecording) return;
    try {
      const audioBlob = await stopRecording();
      const transcription = await transcribeAudio(audioBlob);

      if (transcription && transcription.trim()) {
        setInput(transcription);
        await sendMessage(transcription);
      } else {
        setError("Could not understand the audio. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlayMessage = async (text) => {
    try {
      await playAudio(text);
    } catch (err) {
      setError("Failed to play audio: " + err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleTranslation = (index) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        showTranslation: !updated[index].showTranslation,
      };
      return updated;
    });
  };

  return (
<<<<<<< Updated upstream
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-logo">
            <span className="chat-logo-icon">🗣️</span>
            <h1>ConvoAI</h1>
          </div>
          <span className="chat-subtitle">Spanish Conversation Practice</span>
=======
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "24px", marginBottom: "5px" }}>
            {getScenarioEmoji(selectedScenario)} {currentScenario?.title}
          </h2>
          <p style={{ color: "#666", fontSize: "14px" }}>{currentScenario?.description}</p>
>>>>>>> Stashed changes
        </div>
        <div className="chat-header-right">
          <button
            className={`voice-toggle ${voiceMode ? "voice-toggle--active" : ""}`}
            onClick={() => setVoiceMode(!voiceMode)}
            title={voiceMode ? "Switch to text mode" : "Switch to voice mode"}
          >
            <span className="voice-toggle-icon">{voiceMode ? "🎙️" : "⌨️"}</span>
            <span className="voice-toggle-label">{voiceMode ? "Voice" : "Text"}</span>
          </button>
        </div>
      </header>

<<<<<<< Updated upstream
      <div className="chat-body">
        {/* Voice Orb Section */}
        {voiceMode && (
          <div className="chat-orb-section">
            <VoiceOrb
              state={orbState}
              audioLevel={getActiveAudioLevel()}
              onMouseDown={handleOrbMouseDown}
              onMouseUp={handleOrbMouseUp}
              onTouchStart={handleOrbMouseDown}
              onTouchEnd={handleOrbMouseUp}
            />
            {orbState === "idle" && messages.length === 0 && (
              <p className="chat-orb-hint">
                Press and hold the orb to start speaking in Spanish
              </p>
            )}
          </div>
=======
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 16, padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: 16, background: "linear-gradient(135deg, rgba(249,115,22,0.05), rgba(59,130,246,0.04))" }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Voice practice</div>
          <div style={{ fontSize: 13, color: "#666" }}>
            Press and hold the orb to speak. Tap the speaker icon on a reply to listen again.
          </div>
        </div>
        <button
          onClick={() => setVoiceEnabled((value) => !value)}
          style={{ padding: "8px 12px", borderRadius: 999, border: "1px solid #ddd", background: voiceEnabled ? "#f97316" : "#fff", color: voiceEnabled ? "#fff" : "#111", cursor: "pointer", fontWeight: 600 }}
        >
          {voiceEnabled ? "Voice on" : "Voice off"}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <VoiceOrb
          state={getOrbState()}
          audioLevel={getActiveAudioLevel()}
          onMouseDown={handleOrbMouseDown}
          onMouseUp={handleOrbMouseUp}
          onTouchStart={handleOrbMouseDown}
          onTouchEnd={handleOrbMouseUp}
        />
      </div>

      <div style={{ marginBottom: 20, border: "1px solid #ddd", borderRadius: "12px", padding: "16px", minHeight: "400px", maxHeight: "500px", overflowY: "auto", background: "#f9fafb" }}>
        {messages.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center", paddingTop: "100px" }}>
            Start your conversation in Spanish! 👋
          </p>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: 12, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "70%", padding: "12px 16px", borderRadius: "12px", background: msg.role === "user" ? "#f97316" : "#fff", color: msg.role === "user" ? "#fff" : "#000", border: msg.role === "assistant" ? "1px solid #e5e7eb" : "none" }}>
                  <div>{msg.content}</div>

                  {msg.role === "assistant" && msg.translation && (
                    <div style={{ marginTop: 8 }}>
                      {msg.showTranslation && (
                        <p style={{ fontSize: "14px", opacity: 0.8, marginTop: 4 }}>💬 {msg.translation}</p>
                      )}

                      <button
                        onClick={() => {
                          const updated = [...messages];
                          updated[index].showTranslation = !updated[index].showTranslation;
                          setMessages(updated);
                        }}
                        style={{ marginTop: 6, fontSize: "12px", background: "transparent", border: "1px solid #ddd", padding: "4px 8px", borderRadius: "6px", cursor: "pointer" }}
                      >
                        {msg.showTranslation ? "Hide English" : "👁️ Show English"}
                      </button>
                    </div>
                  )}

                  {msg.role === "assistant" && (
                    <button
                      onClick={() => handleSpeakMessage(msg.content)}
                      disabled={isPlaying || isLoadingAudio}
                      style={{ marginTop: 8, fontSize: 12, padding: "4px 8px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", cursor: isPlaying || isLoadingAudio ? "not-allowed" : "pointer" }}
                    >
                      {isLoadingAudio ? "Loading audio..." : isPlaying ? "Playing..." : "🔊 Speak"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
>>>>>>> Stashed changes
        )}

        {/* Messages Area */}
        <div className="chat-messages-area">
          {messages.length === 0 && (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">💬</div>
              <h3>Start a conversation</h3>
              <p>
                {voiceMode
                  ? "Hold the orb above and speak in Spanish, or type below"
                  : "Type a message in Spanish to begin practicing"}
              </p>
            </div>
          )}

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble chat-bubble--${msg.role}`}
              >
                <div className="chat-bubble-avatar">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className="chat-bubble-body">
                  <div className="chat-bubble-role">
                    {msg.role === "user" ? "You" : "ConvoAI"}
                  </div>
                  <div className="chat-bubble-text">{msg.content}</div>

                  {msg.role === "assistant" && (
                    <div className="chat-bubble-actions">
                      {/* Play audio button */}
                      <button
                        className="chat-action-btn chat-action-btn--speak"
                        onClick={() => handlePlayMessage(msg.content)}
                        disabled={isPlaying || isLoadingAudio}
                        title="Listen to pronunciation"
                      >
                        {isLoadingAudio ? "⏳" : isPlaying ? "⏹️" : "🔊"}
                      </button>

                      {/* Translation toggle */}
                      {msg.translation && (
                        <button
                          className="chat-action-btn chat-action-btn--translate"
                          onClick={() => toggleTranslation(index)}
                          title={msg.showTranslation ? "Hide translation" : "Show English translation"}
                        >
                          {msg.showTranslation ? "🙈" : "👁️"}{" "}
                          {msg.showTranslation ? "Hide" : "English"}
                        </button>
                      )}
                    </div>
                  )}

                  {msg.showTranslation && msg.translation && (
                    <div className="chat-bubble-translation">
                      <span className="translation-label">EN</span>
                      {msg.translation}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="chat-error">
            <span>⚠️</span> {error}
            <button className="chat-error-dismiss" onClick={() => setError("")}>✕</button>
          </div>
        )}

        {/* Input area */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <input
              type="text"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje en español..."
              disabled={loading || isRecording || isTranscribing}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim() || isRecording}
            >
              {loading ? (
                <span className="chat-send-spinner" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
<<<<<<< Updated upstream
=======

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe un mensaje en español..."
          disabled={loading || isRecording || isTranscribing}
          style={{ flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "16px" }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || isRecording}
          style={{ padding: "12px 24px", background: "#f97316", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: 10 }}>Error: {error}</p>}
>>>>>>> Stashed changes
    </div>
  );
}

export default Chat;