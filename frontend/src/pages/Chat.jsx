import { useState, useRef, useEffect } from "react";
import VoiceOrb from "../components/VoiceOrb";
import useVoiceChat from "../hooks/useVoiceChat";
import "./Chat.css";

function Chat() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceMode, setVoiceMode] = useState(true);
  const [orbState, setOrbState] = useState("idle");
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
    stopPlayback,
  } = useVoiceChat();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (!text.trim()) return;

    setError("");
    setLoading(true);

    const token = localStorage.getItem("convoai_token");
    const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("http://localhost:5050/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          history: history,
          scenarioId: selectedScenario,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        {
          role: "assistant",
          content: data.assistantMessage,
          translation: data.translation,
          showTranslation: false,
        },
      ]);

      setInput("");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // Voice recording handlers
  const handleOrbMouseDown = async () => {
    if (!voiceMode) return;
    if (orbState !== "idle") return;
    try {
      await startRecording();
    } catch (err) {
      setError(err.message);
    }
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
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-logo">
            <span className="chat-logo-icon">🗣️</span>
            <h1>ConvoAI</h1>
          </div>
          <span className="chat-subtitle">Spanish Conversation Practice</span>
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
    </div>
  );
}

export default Chat;