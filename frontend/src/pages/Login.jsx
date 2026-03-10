// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  try {
    const res = await fetch("http://localhost:5050/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store REAL token from backend
    await login({ email, token: data.token });

    navigate("/chat");
  } catch (error) {
    setErr(error.message);
  }
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