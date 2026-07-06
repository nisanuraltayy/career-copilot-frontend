import { useState, useEffect } from "react";

function Gecmis() {
  const [aktifTab, setAktifTab] = useState("cv");
  const [cvler, setCvler] = useState([]);
  const [ilanlar, setIlanlar] = useState([]);
  const [uyumlar, setUyumlar] = useState([]);
  const [mektuplar, setMektuplar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    async function tumGecmisleriYukle() {
      try {
        const [cvY, ilanY, uyumY, mektupY] = await Promise.all([
          fetch("http://127.0.0.1:8000/cv-gecmis"),
          fetch("http://127.0.0.1:8000/is-ilanlari"),
          fetch("http://127.0.0.1:8000/uyum-analizi-gecmis"),
          fetch("http://127.0.0.1:8000/motivasyon-mektubu-gecmis"),
        ]);

        const cvV = await cvY.json();
        const ilanV = await ilanY.json();
        const uyumV = await uyumY.json();
        const mektupV = await mektupY.json();

        setCvler(cvV.kayitlar || []);
        setIlanlar(ilanV.ilanlar || []);
        setUyumlar(uyumV.analizler || uyumV.kayitlar || []);
        setMektuplar(mektupV.mektuplar || mektupV.kayitlar || []);
      } catch (e) {
        setHata("Geçmiş yüklenemedi. Backend çalışıyor mu?");
      } finally {
        setYukleniyor(false);
      }
    }

    tumGecmisleriYukle();
  }, []);

  const tablar = [
    { id: "cv", label: "CV'ler", sayisi: cvler.length },
    { id: "ilan", label: "İş İlanları", sayisi: ilanlar.length },
    { id: "uyum", label: "Uyum Analizleri", sayisi: uyumlar.length },
    { id: "mektup", label: "Mektuplar", sayisi: mektuplar.length },
  ];

  return (
    <div>
      <h1 style={{
        fontSize: "42px",
        fontWeight: 800,
        margin: "20px 0 8px",
        background: "linear-gradient(120deg,#FAFAFA,#A855F7)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>Geçmiş</h1>
      <p style={{ color: "#A1A1AA", marginBottom: "32px" }}>
        Tüm önceki analizlerine ve mektuplarına geri dön.
      </p>

      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}>
        {tablar.map((t) => (
          <button
            key={t.id}
            onClick={() => setAktifTab(t.id)}
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              background: aktifTab === t.id
                ? "linear-gradient(135deg,#6366F1,#A855F7)"
                : "rgba(255,255,255,0.04)",
              color: aktifTab === t.id ? "#fff" : "#A1A1AA",
              border: aktifTab === t.id
                ? "none"
                : "1px solid rgba(255,255,255,0.1)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.label} ({t.sayisi})
          </button>
        ))}
      </div>

      {yukleniyor && (
        <div style={{ color: "#A1A1AA" }}>Yükleniyor...</div>
      )}

      {hata && (
        <div style={{
          padding: "16px 20px",
          borderRadius: "12px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#FCA5A5",
        }}>
          {hata}
        </div>
      )}

      {aktifTab === "cv" && !yukleniyor && (
        <Liste
          kayitlar={cvler}
          renderKart={(cv) => (
            <Kart key={cv.id}>
              <KartBaslik>#{cv.id} — {cv.dosya_adi}</KartBaslik>
              <KartSatir>
                {cv.sayfa_sayisi} sayfa · {cv.karakter_sayisi} karakter
              </KartSatir>
              <KartTarih>{cv.yukleme_tarihi}</KartTarih>
            </Kart>
          )}
        />
      )}

      {aktifTab === "ilan" && !yukleniyor && (
        <Liste
          kayitlar={ilanlar}
          renderKart={(ilan) => (
            <Kart key={ilan.id}>
              <KartBaslik>#{ilan.id} — {ilan.pozisyon_adi || "?"}</KartBaslik>
              <KartSatir>{ilan.sirket_adi} · {ilan.deneyim_yili}</KartSatir>
              <KartTarih>{ilan.eklenme_tarihi}</KartTarih>
            </Kart>
          )}
        />
      )}

      {aktifTab === "uyum" && !yukleniyor && (
        <Liste
          kayitlar={uyumlar}
          renderKart={(u) => (
            <Kart key={u.id}>
              <KartBaslik>
                #{u.id} — CV {u.cv_id} ↔ İlan {u.is_ilani_id}
              </KartBaslik>
              <KartSatir>
                V1: <strong style={{ color: "#A855F7" }}>{u.v1_sonuc?.uyum_yuzdesi ?? "?"}%</strong>
                {" · "}
                V2: <strong style={{ color: "#22C55E" }}>{u.v2_sonuc?.uyum_yuzdesi ?? (u.v2_sonuc?.hata ? "hata" : "?")}{u.v2_sonuc?.uyum_yuzdesi !== undefined ? "%" : ""}</strong>
              </KartSatir>
              <KartTarih>{u.olusturma_tarihi}</KartTarih>
            </Kart>
          )}
        />
      )}

      {aktifTab === "mektup" && !yukleniyor && (
        <Liste
          kayitlar={mektuplar}
          renderKart={(m) => (
            <Kart key={m.id}>
              <KartBaslik>
                #{m.id} — {m.pozisyon} @ {m.sirket}
              </KartBaslik>
              <KartSatir style={{
                color: "#FAFAFA",
                fontStyle: "italic",
                marginTop: "8px",
                whiteSpace: "pre-wrap",
                maxHeight: "100px",
                overflow: "hidden",
              }}>
                {(m.mektup_metni || "").substring(0, 200)}...
              </KartSatir>
              <KartTarih>{m.olusturma_tarihi}</KartTarih>
            </Kart>
          )}
        />
      )}
    </div>
  );
}

function Liste({ kayitlar, renderKart }) {
  if (kayitlar.length === 0) {
    return (
      <div style={{
        padding: "40px",
        textAlign: "center",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.04)",
        color: "#A1A1AA",
      }}>
        Henüz kayıt yok.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {kayitlar.map(renderKart)}
    </div>
  );
}

function Kart({ children }) {
  return (
    <div style={{
      padding: "20px",
      borderRadius: "14px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      {children}
    </div>
  );
}

function KartBaslik({ children }) {
  return (
    <h3 style={{
      margin: "0 0 6px",
      color: "#FAFAFA",
      fontSize: "15px",
      fontWeight: 700,
    }}>{children}</h3>
  );
}

function KartSatir({ children, style }) {
  return (
    <div style={{ color: "#A1A1AA", fontSize: "13px", ...style }}>
      {children}
    </div>
  );
}

function KartTarih({ children }) {
  return (
    <div style={{
      color: "#71717A",
      fontSize: "11px",
      marginTop: "8px",
      fontFamily: "monospace",
    }}>
      {children}
    </div>
  );
}

export default Gecmis;