import { useEffect, useMemo, useState } from "react";
import AuthContext from "./auth-context";

const LS_TOKEN = "convoai_token";
const LS_EMAIL = "convoai_email";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(LS_TOKEN));
  const [email, setEmail] = useState(() => localStorage.getItem(LS_EMAIL));

  useEffect(() => {
    if (token) localStorage.setItem(LS_TOKEN, token);
    else localStorage.removeItem(LS_TOKEN);
  }, [token]);

  useEffect(() => {
    if (email) localStorage.setItem(LS_EMAIL, email);
    else localStorage.removeItem(LS_EMAIL);
  }, [email]);

  async function login({ email, token }) {
    setEmail(email);
    setToken(token);
  }

  function logout() {
    setEmail(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({ token, email, isAuthed: !!token, login, logout }),
    [token, email]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}