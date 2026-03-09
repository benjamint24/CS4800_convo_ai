// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!email.includes("@")) return setErr("Enter a valid email.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");

    // If you already have backend login endpoint wired, replace with API call.
    // For now, just call login with a fake token or the real response token.
    await login({ email, token: "demo-token" });

    navigate("/");
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Log in</h1>
      <p>Practice Spanish conversations in a restaurant scenario.</p>

      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {err && <p style={{ color: "crimson" }}>{err}</p>}

        <button type="submit">Log in</button>
      </form>

      <p style={{ marginTop: 12 }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}