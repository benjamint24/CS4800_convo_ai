import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={{ borderBottom: "1px solid #ddd", padding: "12px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 12 }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: "none" }}>
          ConvoAI
        </Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </header>
  );
}