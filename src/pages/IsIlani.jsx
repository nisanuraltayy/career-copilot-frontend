import { useState } from "react";

function IsIlani() {
  const [metin, setMetin] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState(null);

  async function analizEt() {
    if (!metin.trim()) {
      setHata("Lütfen bir iş ilanı metni girin.");
      return;
    }

    setYukleniyor(true);
    setHata(null);
    setSonuc(null);

    try {
      const yanit = await fetch("http://127.0.0.1:8000/is-ilani-analiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metin: metin }),
      });
      const veri = await yanit.json();

      if (veri.hata) {
        setHata(veri.hata);
      } else {
        setSonuc(veri);
      }
    } catch (e) {
      setHata("Sunucuya ulaşılamadı. Backend çalışıyor mu?");
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
      }}>İş İlanı Analizi</h1>
      <p style={{ color: "#A1A1AA", marginBottom: "32px" }}>
        Bir iş ilanı metnini yapıştır, AI gereksinimleri çıkarsın.
      </p>

      <div style={{
        padding: "32px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <textarea
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          placeholder="İş ilanı metnini buraya yapıştır..."
          rows={12}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#FAFAFA",
            fontFamily: "inherit",
            fontSize: "14px",
            resize: "vertical",
            marginBottom: "16px",
          }}
        />

        <button
          onClick={analizEt}
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
          }}
        >
          {yukleniyor ? "Analiz Ediliyor..." : "Analiz Et"}
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
          padding: "24px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <h3 style={{
            margin: "0 0 16px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#A855F7",
          }}>Analiz Sonucu</h3>

          <div style={{ marginBottom: "12px" }}>
            <strong>Pozisyon:</strong> {sonuc.analiz?.pozisyon_adi || "—"}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong>Şirket:</strong> {sonuc.analiz?.sirket_adi || "—"}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong>Deneyim:</strong> {sonuc.analiz?.deneyim_yili || "—"}
          </div>

          <h4 style={{ color: "#A855F7", marginTop: "20px" }}>Gerekli Beceriler</h4>
          <ul>
            {(sonuc.analiz?.gerekli_beceriler || []).map((b, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>{b}</li>
            ))}
          </ul>

          <h4 style={{ color: "#A855F7", marginTop: "20px" }}>Tercih Edilen Beceriler</h4>
          <ul>
            {(sonuc.analiz?.tercih_edilen_beceriler || []).map((b, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>{b}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default IsIlani;