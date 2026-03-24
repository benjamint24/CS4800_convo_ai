import { useEffect, useState } from "react";

function Chat() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchScenarios();
  }, []);

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

  const sendMessage = async () => {
    if (!input.trim()) return;

    setError("");
    setLoading(true);

    const token = localStorage.getItem("convoai_token");
    const history = messages.slice(-8);

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

      setMessages([
        ...messages,
        { role: "user", content: input },
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

  const getScenarioEmoji = (scenarioId) => {
    const emojis = { restaurant: "🍽️", travel: "🗺️", smallTalk: "💬" };
    return emojis[scenarioId] || "💬";
  };

  if (!selectedScenario) {
    return (
      <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Choose a Scenario</h1>
        <p style={{ color: "#666", marginBottom: "40px" }}>
          Select a conversation scenario to start practicing Spanish
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => startScenario(scenario.id)}
              style={{
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.2s",
                background: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#f97316";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                {getScenarioEmoji(scenario.id)}
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
                {scenario.title}
              </h3>
              <p style={{ color: "#666", fontSize: "14px" }}>{scenario.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentScenario = scenarios.find((s) => s.id === selectedScenario);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "24px", marginBottom: "5px" }}>
            {getScenarioEmoji(selectedScenario)} {currentScenario?.title}
          </h2>
          <p style={{ color: "#666", fontSize: "14px" }}>{currentScenario?.description}</p>
        </div>
        <button
          onClick={() => setSelectedScenario(null)}
          style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff", cursor: "pointer" }}
        >
          ← Change Scenario
        </button>
      </div>

      <div style={{ marginBottom: 20, border: "1px solid #ddd", borderRadius: "12px", padding: "16px", minHeight: "400px", maxHeight: "500px", overflowY: "auto", background: "#f9fafb" }}>
        {messages.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center", paddingTop: "100px" }}>
            Start your conversation in Spanish! 👋
          </p>
        ) : (
          messages.map((msg, index) => (
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
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe un mensaje en español..."
          style={{ flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "16px" }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ padding: "12px 24px", background: "#f97316", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: 10 }}>Error: {error}</p>}
    </div>
  );
}

export default Chat;