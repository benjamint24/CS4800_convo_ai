import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Container from "./Container";

export default function Layout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "24px 16px" }}>
        <Container>
          <Outlet />
        </Container>
      </main>

      <footer style={{ borderTop: "1px solid #ddd", padding: "12px 16px" }}>
        <Container>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            © {new Date().getFullYear()} ConvoAI
          </div>
        </Container>
      </footer>
    </div>
  );
}