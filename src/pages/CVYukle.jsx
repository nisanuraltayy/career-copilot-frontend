import { useState } from "react";
import { api } from "../lib/api";

function CVYukle() {
  const [dosya, setDosya] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState(null);

  async function yukle() {
    if (!dosya) {
      setHata("Lütfen önce bir PDF seçin.");
      return;
    }

    setYukleniyor(true);
    setHata(null);
    setSonuc(null);

    try {
      const veri = await api.cvYukle(dosya);
      setSonuc(veri);
    } catch (e) {
      setHata(e.message);
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div>
      <h1 style={{
        fontSize: "42px",
        fontWeight: 800,
        margin: "20px 0 8px",
        background: "linear-gradient(120deg,#FAFAFA,#A855F7)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>CV Analizi</h1>
      <p style={{ color: "#A1A1AA", marginBottom: "32px" }}>
        PDF formatında özgeçmişini yükle, AI becerilerini ve deneyimlerini çıkarsın.
      </p>

      <div style={{
        padding: "40px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.04)",
        border: "1px dashed rgba(255,255,255,0.2)",
        textAlign: "center",
      }}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setDosya(e.target.files[0])}
          style={{
            display: "block",
            margin: "0 auto 20px",
            color: "#FAFAFA",
          }}
        />

        {dosya && (
          <p style={{ color: "#A855F7", fontSize: "14px" }}>
            Seçilen: {dosya.name}
          </p>
        )}

        <button
          onClick={yukle}
          disabled={yukleniyor}
          style={{
            padding: "14px 32px",
            borderRadius: "12px",
            background: yukleniyor 
              ? "rgba(255,255,255,0.1)" 
              : "linear-gradient(135deg,#6366F1,#A855F7)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "15px",
            border: "none",
            cursor: yukleniyor ? "not-allowed" : "pointer",
            marginTop: "12px",
          }}
        >
          {yukleniyor ? "Yükleniyor..." : "Yükle ve Analiz Et"}
        </button>
      </div>

      {hata && (
        <div style={{
          marginTop: "24px",
          padding: "16px 20px",
          borderRadius: "12px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#FCA5A5",
        }}>
          {hata}
        </div>
      )}

      {sonuc && (
        <div style={{
          marginTop: "32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          <SonucKarti baslik="Beceriler" liste={sonuc.analiz?.beceriler || []} />
          <SonucKarti baslik="Deneyimler" liste={sonuc.analiz?.deneyimler || []} />
          <SonucKarti
            baslik="Eğitim"
            liste={sonuc.analiz?.egitim ? [sonuc.analiz.egitim] : []}
          />
        </div>
      )}
    </div>
  );
}

function SonucKarti({ baslik, liste }) {
  return (
    <div style={{
      padding: "24px",
      borderRadius: "16px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      <h3 style={{
        margin: "0 0 16px",
        fontSize: "16px",
        fontWeight: 700,
        color: "#A855F7",
      }}>{baslik}</h3>
      <ul style={{ margin: 0, paddingLeft: "20px", color: "#FAFAFA" }}>
        {liste.map((item, i) => (
          <li key={i} style={{ marginBottom: "8px", lineHeight: 1.5 }}>
            {typeof item === "string" 
              ? item 
              : item.pozisyon && item.sirket 
                ? `${item.pozisyon} — ${item.sirket}` 
                : JSON.stringify(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CVYukle;