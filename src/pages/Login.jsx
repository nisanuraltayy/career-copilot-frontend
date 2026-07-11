import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

function Login() {
  const { girisYap } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState(null);

  async function gonder(e) {
    e.preventDefault();
    setHata(null);
    setYukleniyor(true);
    try {
      await girisYap(email.trim(), parola);
      navigate("/");
    } catch (err) {
      setHata(err.message);
    } finally {
      setYukleniyor(false);
    }
  }

  return <AuthForm
    baslik="Giriş Yap"
    altMetin="Hesabın yok mu?"
    altLink={{ to: "/register", text: "Kayıt ol" }}
    email={email} setEmail={setEmail}
    parola={parola} setParola={setParola}
    yukleniyor={yukleniyor} hata={hata}
    onSubmit={gonder} buton="Giriş Yap"
  />;
}

export function AuthForm({ baslik, altMetin, altLink, email, setEmail, parola, setParola, yukleniyor, hata, onSubmit, buton }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0A0A0F", color: "#FAFAFA", fontFamily: "'Inter', sans-serif", padding: "24px" }}>
      <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: "400px", padding: "36px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px", background: "linear-gradient(135deg,#FAFAFA,#A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{baslik}</h1>

        <label style={labelStyle}>E-posta</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="ornek@eposta.com" />

        <label style={labelStyle}>Parola</label>
        <input type="password" value={parola} onChange={(e) => setParola(e.target.value)} required minLength={8} style={inputStyle} placeholder="En az 8 karakter" />

        {hata && (
          <div style={{ margin: "8px 0 16px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5", fontSize: "13px" }}>
            {hata}
          </div>
        )}

        <button type="submit" disabled={yukleniyor} style={{ width: "100%", padding: "14px", borderRadius: "12px", marginTop: "8px", background: yukleniyor ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#6366F1,#A855F7)", color: "#fff", fontWeight: 700, fontSize: "15px", border: "none", cursor: yukleniyor ? "not-allowed" : "pointer" }}>
          {yukleniyor ? "Lütfen bekleyin..." : buton}
        </button>

        <p style={{ marginTop: "20px", textAlign: "center", color: "#A1A1AA", fontSize: "14px" }}>
          {altMetin}{" "}
          <Link to={altLink.to} style={{ color: "#A855F7", fontWeight: 600 }}>{altLink.text}</Link>
        </p>
      </form>
    </div>
  );
}

const labelStyle = { display: "block", marginBottom: "8px", color: "#A1A1AA", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "12px 16px", marginBottom: "18px", borderRadius: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#FAFAFA", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" };

export default Login;
