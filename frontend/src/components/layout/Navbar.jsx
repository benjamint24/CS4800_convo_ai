import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthed, email, logout } = useAuth();

  return (
    <header style={{ borderBottom: "1px solid #ddd", padding: "12px 16px" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/" style={{ fontWeight: 700, textDecoration: "none" }}>
            ConvoAI
          </Link>
          <Link to="/">Home</Link>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!isAuthed ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span style={{ fontSize: 13, opacity: 0.75 }}>
                Logged in as {email}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}