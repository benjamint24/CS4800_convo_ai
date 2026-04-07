import { useEffect, useRef, useState } from "react";
import VoiceOrb from "../components/VoiceOrb";
import useVoiceChat from "../hooks/useVoiceChat";
import "./Chat.css";

const FALLBACK_SCENARIO = {
  id: "restaurant",
  title: "Restaurant Conversation",
  description: "Practice ordering food and responding naturally in Spanish.",
};

function Chat() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("restaurant");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceMode, setVoiceMode] = useState(true);
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

  const currentScenario = scenarios.find((scenario) => scenario.id === selectedScenario) || FALLBACK_SCENARIO;
  const scenarioOptions = scenarios.length > 0 ? scenarios : [FALLBACK_SCENARIO];

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const token = localStorage.getItem("convoai_token");
        const response = await fetch("http://localhost:5050/api/scenarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load scenarios");
        }

        const data = await response.json();
        setScenarios(data.scenarios || []);

        if (data.scenarios?.length && !data.scenarios.some((scenario) => scenario.id === selectedScenario)) {
          setSelectedScenario(data.scenarios[0].id);
        }
      } catch (fetchError) {
        console.error("Failed to fetch scenarios:", fetchError);
      }
    };

    fetchScenarios();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (!text.trim()) return;

    setError("");
    setLoading(true);

    const token = localStorage.getItem("convoai_token");
    const history = messages.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    try {
      const response = await fetch("http://localhost:5050/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          history,
          scenarioId: selectedScenario,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
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

      if (voiceMode && data.assistantMessage) {
        await playAudio(data.assistantMessage);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrbMouseDown = async () => {
    if (!voiceMode || getOrbState() !== "idle") return;

    try {
      await startRecording();
    } catch (requestError) {
      setError(requestError.message);
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
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handlePlayMessage = async (text) => {
    try {
      await playAudio(text);
    } catch (requestError) {
      setError(`Failed to play audio: ${requestError.message}`);
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-logo">
            <span className="chat-logo-icon">🗣️</span>
            <h1>ConvoAI</h1>
          </div>
          <div className="chat-scenario-copy">
            <span className="chat-subtitle">{currentScenario.title}</span>
            <p className="chat-description">{currentScenario.description}</p>
          </div>
        </div>

        <div className="chat-header-right">
          <label className="chat-scenario-select">
            <span>Scenario</span>
            <select value={selectedScenario} onChange={(event) => setSelectedScenario(event.target.value)}>
              {scenarioOptions.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.title}
                </option>
              ))}
            </select>
          </label>

          <button
            className={`voice-toggle ${voiceMode ? "voice-toggle--active" : ""}`}
            onClick={() => setVoiceMode((value) => !value)}
            type="button"
            title={voiceMode ? "Switch to text mode" : "Switch to voice mode"}
          >
            <span className="voice-toggle-icon">{voiceMode ? "🎙️" : "⌨️"}</span>
            <span className="voice-toggle-label">{voiceMode ? "Voice" : "Text"}</span>
          </button>
        </div>
      </header>

      <div className="chat-body">
        {voiceMode && (
          <div className="chat-orb-section">
            <VoiceOrb
              state={getOrbState()}
              audioLevel={getActiveAudioLevel()}
              onMouseDown={handleOrbMouseDown}
              onMouseUp={handleOrbMouseUp}
              onTouchStart={handleOrbMouseDown}
              onTouchEnd={handleOrbMouseUp}
            />
            {getOrbState() === "idle" && messages.length === 0 && (
              <p className="chat-orb-hint">Press and hold the orb to start speaking in Spanish</p>
            )}
          </div>
        )}

        <div className="chat-messages-area">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">💬</div>
              <h3>Start a conversation</h3>
              <p>{voiceMode ? "Hold the orb above or type below" : "Type a message in Spanish to begin practicing"}</p>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`chat-bubble chat-bubble--${message.role}`}>
                  <div className="chat-bubble-avatar">{message.role === "user" ? "👤" : "🤖"}</div>
                  <div className="chat-bubble-body">
                    <div className="chat-bubble-role">{message.role === "user" ? "You" : "ConvoAI"}</div>
                    <div className="chat-bubble-text">{message.content}</div>

                    {message.role === "assistant" && (
                      <div className="chat-bubble-actions">
                        <button
                          className="chat-action-btn chat-action-btn--speak"
                          onClick={() => handlePlayMessage(message.content)}
                          disabled={isPlaying || isLoadingAudio}
                          type="button"
                          title="Listen to pronunciation"
                        >
                          {isLoadingAudio ? "⏳" : isPlaying ? "⏹️" : "🔊"}
                        </button>

                        {message.translation && (
                          <button
                            className="chat-action-btn chat-action-btn--translate"
                            onClick={() => toggleTranslation(index)}
                            type="button"
                            title={message.showTranslation ? "Hide translation" : "Show English translation"}
                          >
                            {message.showTranslation ? "🙈" : "👁️"} {message.showTranslation ? "Hide" : "English"}
                          </button>
                        )}
                      </div>
                    )}

                    {message.showTranslation && message.translation && (
                      <div className="chat-bubble-translation">
                        <span className="translation-label">EN</span>
                        {message.translation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="chat-error">
            <span>⚠️</span>
            <span>{error}</span>
            <button className="chat-error-dismiss" onClick={() => setError("")} type="button">
              ✕
            </button>
          </div>
        )}

        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <input
              type="text"
              className="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje en español..."
              disabled={loading || isRecording || isTranscribing}
            />
            <button className="chat-send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim() || isRecording} type="button">
              {loading ? (
                <span className="chat-send-spinner" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
