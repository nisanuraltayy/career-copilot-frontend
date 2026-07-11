import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
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
          flexWrap: "wrap",
          gap: "12px",
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

          <nav className="site-nav">
            <NavLink to="/cv" className="nav-link">CV</NavLink>
            <NavLink to="/ilan" className="nav-link">İlan</NavLink>
            <NavLink to="/oneriler" className="nav-link">Öneriler</NavLink>
            <NavLink to="/uyum" className="nav-link">Uyum</NavLink>
            <NavLink to="/mektup" className="nav-link">Mektup</NavLink>
            <NavLink to="/gecmis" className="nav-link">Geçmiş</NavLink>
            {user?.email && <span className="user-email">{user.email}</span>}
            <button onClick={cikis} className="logout-btn">Çıkış</button>
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

export default Layout;