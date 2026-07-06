import { useState, useEffect } from "react";

function MotivasyonMektubu() {
  const [cvler, setCvler] = useState([]);
  const [ilanlar, setIlanlar] = useState([]);
  const [secilenCv, setSecilenCv] = useState("");
  const [secilenIlan, setSecilenIlan] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    async function listeleriYukle() {
      try {
        const [cvYanit, ilanYanit] = await Promise.all([
          fetch("http://127.0.0.1:8000/cv-gecmis"),
          fetch("http://127.0.0.1:8000/is-ilanlari"),
        ]);
        const cvVeri = await cvYanit.json();
        const ilanVeri = await ilanYanit.json();
        setCvler(cvVeri.kayitlar || []);
        setIlanlar(ilanVeri.ilanlar || []);
      } catch (e) {
        setHata("Listeler yüklenemedi.");
      }
    }
    listeleriYukle();
  }, []);

  async function uret() {
    if (!secilenCv || !secilenIlan) {
      setHata("Lütfen hem CV hem de iş ilanı seçin.");
      return;
    }

    setYukleniyor(true);
    setHata(null);
    setSonuc(null);

    try {
      const yanit = await fetch("http://127.0.0.1:8000/motivasyon-mektubu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv_id: parseInt(secilenCv),
          is_ilani_id: parseInt(secilenIlan),
        }),
      });
      const veri = await yanit.json();

      if (veri.hata) {
        setHata(veri.hata);
      } else {
        setSonuc(veri);
      }
    } catch (e) {
      setHata("Sunucuya ulaşılamadı.");
    } finally {
      setYukleniyor(false);
    }
  }

  function kopyala() {
    if (sonuc?.mektup_metni) {
      navigator.clipboard.writeText(sonuc.mektup_metni);
      alert("Mektup panoya kopyalandı!");
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
      }}>Motivasyon Mektubu</h1>
      <p style={{ color: "#A1A1AA", marginBottom: "32px" }}>
        AI ile CV'ne ve seçtiğin iş ilanına özel motivasyon mektubu üret.
      </p>

      <div style={{
        padding: "32px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>CV Seç</label>
          <select value={secilenCv} onChange={(e) => setSecilenCv(e.target.value)} style={selectStyle}>
            <option value="">— CV seçin —</option>
            {cvler.map((cv) => (
              <option key={cv.id} value={cv.id}>#{cv.id} — {cv.dosya_adi}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>İş İlanı Seç</label>
          <select value={secilenIlan} onChange={(e) => setSecilenIlan(e.target.value)} style={selectStyle}>
            <option value="">— İlan seçin —</option>
            {ilanlar.map((ilan) => (
              <option key={ilan.id} value={ilan.id}>
                #{ilan.id} — {ilan.pozisyon_adi || "?"} @ {ilan.sirket_adi || "?"}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={uret}
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
          {yukleniyor ? "Mektup Yazılıyor..." : "Mektubu Üret"}
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
          padding: "32px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ color: "#A855F7", margin: "0 0 4px", fontSize: "18px" }}>
                Motivasyon Mektubu
              </h3>
              {sonuc.pozisyon && sonuc.sirket && (
                <p style={{ margin: 0, color: "#A1A1AA", fontSize: "13px" }}>
                  {sonuc.pozisyon} @ {sonuc.sirket}
                </p>
              )}
            </div>
            <button onClick={kopyala} style={{
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(168,85,247,0.15)",
              color: "#A855F7",
              border: "1px solid rgba(168,85,247,0.3)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}>
              📋 Kopyala
            </button>
          </div>

          <div style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.7,
            color: "#FAFAFA",
            fontSize: "14px",
            padding: "20px",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "12px",
          }}>
            {sonuc.mektup_metni || JSON.stringify(sonuc, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#A1A1AA",
  fontSize: "14px",
};

const selectStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#FAFAFA",
  fontSize: "14px",
  fontFamily: "inherit",
  cursor: "pointer",
};

export default MotivasyonMektubu;