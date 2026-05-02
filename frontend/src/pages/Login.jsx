import { useEffect, useState } from "react"; // ADD useEffect here
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../state/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { login, isAuthed } = useAuth();

  useEffect(() => {
    if (isAuthed) {
      navigate('/chat');
    }
  }, [isAuthed, navigate]);

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
      await login({ email, token: data.token });
      navigate("/chat");
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-orange-500">
          Convo<span className="text-blue-900">AI</span>
        </h1>
        <p className="text-gray-600 text-center mt-2 mb-6">
          Log in to practice conversations in multiple languages
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {err && (
            <p className="text-red-500 text-sm">{err}</p>
          )}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link className="text-orange-500 font-semibold hover:underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}