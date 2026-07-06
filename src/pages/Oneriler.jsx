import { useState, useEffect } from "react";

function Oneriler() {
  const [cvler, setCvler] = useState([]);
  const [secilenCv, setSecilenCv] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    async function cvleriYukle() {
      try {
        const yanit = await fetch("http://127.0.0.1:8000/cv-gecmis");
        const veri = await yanit.json();
        setCvler(veri.kayitlar || []);
      } catch (e) {
        setHata("CV listesi yüklenemedi. Backend çalışıyor mu?");
      }
    }
    cvleriYukle();
  }, []);

  async function onerileriGetir() {
    if (!secilenCv) {
      setHata("Lütfen bir CV seçin.");
      return;
    }

    setYukleniyor(true);
    setHata(null);
    setSonuc(null);

    try {
      const yanit = await fetch(
        `http://127.0.0.1:8000/is-onerileri/${parseInt(secilenCv)}`
      );
      const veri = await yanit.json();

      if (veri.detail) {
        // FastAPI HTTPException "detail" doner (404/400)
        setHata(typeof veri.detail === "string" ? veri.detail : "Öneri alınamadı.");
      } else {
        setSonuc(veri);
      }
    } catch (e) {
      setHata("Sunucuya ulaşılamadı.");
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
      }}>İş Önerileri</h1>
      <p style={{ color: "#A1A1AA", marginBottom: "32px" }}>
        Bir CV seç, sana en uygun ilanları uyum skoruna göre sıralayalım.
      </p>

      <div style={{
        padding: "32px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#A1A1AA", fontSize: "14px" }}>
            CV Seç
          </label>
          <select
            value={secilenCv}
            onChange={(e) => setSecilenCv(e.target.value)}
            style={selectStyle}
          >
            <option value="">— CV seçin —</option>
            {cvler.map((cv) => (
              <option key={cv.id} value={cv.id}>
                #{cv.id} — {cv.dosya_adi}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onerileriGetir}
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
          {yukleniyor ? "Aranıyor..." : "Önerileri Getir"}
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
        <div style={{ marginTop: "32px" }}>
          <p style={{ color: "#A1A1AA", marginBottom: "20px", fontSize: "14px" }}>
            <strong style={{ color: "#FAFAFA" }}>{sonuc.cv_dosya_adi}</strong> için{" "}
            {sonuc.toplam_oneri} öneri bulundu.
          </p>

          {sonuc.toplam_oneri === 0 ? (
            <div style={{
              padding: "24px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#A1A1AA",
            }}>
              Henüz eşleşecek ilan yok. Önce birkaç iş ilanı ekleyin.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {sonuc.oneriler.map((oneri) => (
                <OneriKarti key={oneri.ilan_id} oneri={oneri} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OneriKarti({ oneri }) {
  const skor = oneri.uyum_skoru ?? 0;
  // Skora gore renk: yuksek yesil, orta sari, dusuk kirmizi
  const renk = skor >= 75 ? "#22C55E" : skor >= 50 ? "#EAB308" : "#EF4444";

  return (
    <div style={{
      padding: "24px",
      borderRadius: "16px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "20px",
    }}>
      <div>
        <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#FAFAFA" }}>
          {oneri.pozisyon_adi || "Belirtilmemiş"}
        </h3>
        <p style={{ margin: 0, color: "#A1A1AA", fontSize: "14px" }}>
          {oneri.sirket_adi || "Şirket belirtilmemiş"}
          {oneri.deneyim_yili ? ` · ${oneri.deneyim_yili}` : ""}
        </p>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: "32px", fontWeight: 800, color: renk, lineHeight: 1 }}>
          %{skor}
        </div>
        <div style={{ fontSize: "12px", color: "#71717A", marginTop: "4px" }}>
          uyum
        </div>
      </div>
    </div>
  );
}

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

export default Oneriler;