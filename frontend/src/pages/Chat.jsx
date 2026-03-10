import { useState } from "react";

function Chat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    setError("");
    setResponse("");
    setLoading(true);

    try {
      const token = localStorage.getItem("convoai_token");

      const res = await fetch("http://localhost:5050/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setResponse(data.assistantMessage);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Chat (Sprint 2 Demo)</h2>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje en español..."
        style={{ width: "300px", marginRight: "10px" }}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {response && (
        <div style={{ marginTop: "20px" }}>
          <strong>AI Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default Chat;