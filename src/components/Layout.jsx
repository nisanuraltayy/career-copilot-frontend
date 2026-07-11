import { Link, Outlet, useNavigate } from "react-router-dom";
import GradientBlobs from "./GradientBlobs";
import { useAuth } from "../lib/auth";

function Layout() {
  const { user, cikisYap } = useAuth();
  const navigate = useNavigate();

  function cikis() {
    cikisYap();
    navigate("/login");
  }

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      background: "#0A0A0F",
      color: "#FAFAFA",
      fontFamily: "'Inter', sans-serif",
      overflow: "hidden",
    }}>
      <GradientBlobs />

      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(18px)",
        background: "rgba(10,10,15,0.6)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link to="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "11px",
            textDecoration: "none",
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              background: "linear-gradient(135deg,#6366F1,#A855F7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "14px",
              color: "#fff",
            }}>C</div>
            <span style={{
              fontSize: "18px",
              fontWeight: 800,
              background: "linear-gradient(135deg,#FAFAFA,#A855F7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Career Copilot</span>
          </Link>

          <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Link to="/cv" style={navLinkStyle}>CV</Link>
            <Link to="/ilan" style={navLinkStyle}>İlan</Link>
            <Link to="/oneriler" style={navLinkStyle}>Öneriler</Link>
            <Link to="/uyum" style={navLinkStyle}>Uyum</Link>
            <Link to="/mektup" style={navLinkStyle}>Mektup</Link>
            <Link to="/gecmis" style={navLinkStyle}>Geçmiş</Link>
            {user?.email && (
              <span style={{ fontSize: "13px", color: "#71717A", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </span>
            )}
            <button
              onClick={cikis}
              style={{ padding: "7px 14px", borderRadius: "9px", background: "rgba(255,255,255,0.06)", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.12)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Çıkış
            </button>
          </nav>
        </div>
      </header>

      <main style={{
        position: "relative",
        zIndex: 10,
        maxWidth: "1120px",
        margin: "0 auto",
        padding: "40px 24px 100px",
      }}>
        <Outlet />
      </main>
    </div>
  );
}

const navLinkStyle = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#A1A1AA",
  textDecoration: "none",
};

export default Layout;