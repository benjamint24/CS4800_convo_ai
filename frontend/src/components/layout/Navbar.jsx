import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthed, email, logout } = useAuth();
  
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl font-bold text-orange-500"
          >
            Convo<span className="text-blue-900">AI</span>
          </Link>
          <Link
            to="/"
            className="text-gray-600 hover:text-black"
          >
            Home
          </Link>
          {/* ADD CHAT LINK WHEN LOGGED IN */}
          {isAuthed && (
            <Link
              to="/chat"
              className="text-gray-600 hover:text-black"
            >
              Chat
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {!isAuthed ? (
            <>
              <Link
                to="/login"
                className="border-2 border-blue-900 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600">
                {email}
              </span>
              <button
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
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