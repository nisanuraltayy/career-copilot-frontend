import { useState, useEffect } from "react";
import { api } from "../lib/api";

function UyumAnalizi() {
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
        const [cvVeri, ilanVeri] = await Promise.all([
          api.cvGecmis(),
          api.ilanlar(),
        ]);
        setCvler(cvVeri.kayitlar || []);
        setIlanlar(ilanVeri.ilanlar || []);
      } catch (e) {
        setHata(e.message);
      }
    }

    listeleriYukle();
  }, []);

  async function analizEt() {
    if (!secilenCv || !secilenIlan) {
      setHata("Lütfen hem CV hem de iş ilanı seçin.");
      return;
    }

    setYukleniyor(true);
    setHata(null);
    setSonuc(null);

    try {
      const veri = await api.uyumAnaliz(parseInt(secilenCv), parseInt(secilenIlan));
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
      }}>Uyum Analizi</h1>
      <p style={{ color: "#A1A1AA", marginBottom: "32px" }}>
        CV ile iş ilanı arasındaki uyumu yüzdelik olarak gör.
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

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#A1A1AA", fontSize: "14px" }}>
            İş İlanı Seç
          </label>
          <select
            value={secilenIlan}
            onChange={(e) => setSecilenIlan(e.target.value)}
            style={selectStyle}
          >
            <option value="">— İlan seçin —</option>
            {ilanlar.map((ilan) => (
              <option key={ilan.id} value={ilan.id}>
                #{ilan.id} — {ilan.pozisyon_adi || "?"} @ {ilan.sirket_adi || "?"}
              </option>
            ))}
          </select>
        </div>

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
          {yukleniyor ? "Analiz Ediliyor..." : "Uyumu Hesapla"}
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
        <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>

          <div style={{
            padding: "32px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <h3 style={{ color: "#A855F7", marginBottom: "16px", fontSize: "18px" }}>
              V1 - Kelime Karşılaştırma
            </h3>

            <div style={{ fontSize: "48px", fontWeight: 800, marginBottom: "20px" }}>
              <span style={{
                background: "linear-gradient(135deg,#6366F1,#A855F7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {sonuc.v1_basit?.uyum_yuzdesi ?? 0}%
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <BecerKutusu
                baslik="Eşleşen Gerekli"
                renk="#22C55E"
                liste={sonuc.v1_basit?.eslesen_gerekli_beceriler || []}
              />
              <BecerKutusu
                baslik="Eksik Gerekli"
                renk="#EF4444"
                liste={sonuc.v1_basit?.eksik_gerekli_beceriler || []}
              />
              <BecerKutusu
                baslik="Ekstra Beceriler"
                renk="#A1A1AA"
                liste={sonuc.v1_basit?.ekstra_beceriler || []}
              />
            </div>
          </div>

          <div style={{
            padding: "32px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <h3 style={{ color: "#A855F7", marginBottom: "16px", fontSize: "18px" }}>
              V2 - LLM Akıllı Analiz
            </h3>

            {sonuc.v2_llm?.hata ? (
              <div style={{ color: "#FCA5A5" }}>
                {sonuc.v2_llm.hata}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "48px", fontWeight: 800, marginBottom: "20px" }}>
                  <span style={{
                    background: "linear-gradient(135deg,#22C55E,#A855F7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    {sonuc.v2_llm?.uyum_yuzdesi ?? 0}%
                  </span>
                </div>

                {sonuc.v2_llm?.ozet && (
                  <p style={{
                    color: "#FAFAFA",
                    lineHeight: 1.6,
                    marginBottom: "24px",
                    fontSize: "14px",
                    padding: "16px",
                    background: "rgba(168,85,247,0.08)",
                    borderRadius: "12px",
                    borderLeft: "3px solid #A855F7",
                  }}>
                    {sonuc.v2_llm.ozet}
                  </p>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                  <BecerKutusu
                    baslik="Güçlü Yönler"
                    renk="#22C55E"
                    liste={sonuc.v2_llm?.guclu_yonler || []}
                  />
                  <BecerKutusu
                    baslik="Eksik Yönler"
                    renk="#EF4444"
                    liste={sonuc.v2_llm?.eksik_yonler || []}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

function BecerKutusu({ baslik, renk, liste }) {
  return (
    <div style={{
      padding: "16px",
      borderRadius: "12px",
      background: "rgba(0,0,0,0.2)",
      border: `1px solid ${renk}33`,
    }}>
      <h4 style={{ color: renk, margin: "0 0 12px", fontSize: "13px", fontWeight: 700 }}>
        {baslik} ({liste.length})
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {liste.length === 0 ? (
          <span style={{ color: "#A1A1AA", fontSize: "12px" }}>Yok</span>
        ) : (
          liste.map((b, i) => (
            <span key={i} style={{
              padding: "4px 10px",
              borderRadius: "100px",
              background: `${renk}22`,
              color: renk,
              fontSize: "12px",
              fontWeight: 600,
            }}>
              {b}
            </span>
          ))
        )}
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

export default UyumAnalizi;