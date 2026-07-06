import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <section style={{
        textAlign: "center",
        padding: "80px 0 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "22px",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "30px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: "12.5px",
          fontWeight: 600,
          color: "#A1A1AA",
        }}>
          <span style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#6366F1,#A855F7)",
          }} />
          Yapay zekâ destekli kariyer asistanı
        </div>

        <h1 style={{
          margin: 0,
          maxWidth: "800px",
          fontSize: "54px",
          lineHeight: 1.1,
          fontWeight: 800,
          letterSpacing: "-1.6px",
          color: "#FAFAFA",
        }}>
          CV'nizi yükleyin,{" "}
          <span style={{
            background: "linear-gradient(120deg,#818CF8,#A855F7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>hayalinizdeki işe</span>{" "}
          nasıl yaklaştığınızı görün
        </h1>

        <p style={{
          margin: 0,
          maxWidth: "560px",
          fontSize: "17px",
          lineHeight: 1.6,
          color: "#A1A1AA",
        }}>
          Özgeçmişinizi saniyeler içinde analiz edelim. Becerilerinizi, deneyimlerinizi ve eğitiminizi çıkarıp iş ilanlarıyla uyumunuzu ortaya koyalım.
        </p>

        <Link to="/cv" style={{
          marginTop: "12px",
          padding: "14px 32px",
          borderRadius: "12px",
          background: "linear-gradient(135deg,#6366F1,#A855F7)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "15px",
          textDecoration: "none",
          boxShadow: "0 12px 32px rgba(99,102,241,0.4)",
        }}>
          Hemen Başla →
        </Link>
      </section>

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        marginTop: "40px",
      }}>
        <FeatureCard
          title="CV Analizi"
          desc="PDF'ini yükle, AI becerilerini ve deneyimlerini çıkarsın."
          to="/cv"
        />
        <FeatureCard
          title="İş İlanı Analizi"
          desc="Bir iş ilanı metnini yapıştır, gereksinimleri çıkar."
          to="/ilan"
        />
        <FeatureCard
          title="Uyum Analizi"
          desc="CV ile ilan arasındaki uyumu yüzdelik olarak gör."
          to="/uyum"
        />
        <FeatureCard
          title="Motivasyon Mektubu"
          desc="AI ile kişiselleştirilmiş mektup üret."
          to="/mektup"
        />
        <FeatureCard
          title="Geçmiş"
          desc="Tüm önceki analizlerine geri dön."
          to="/gecmis"
        />
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, to }) {
  return (
    <Link to={to} style={{
      display: "block",
      padding: "24px",
      borderRadius: "16px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      textDecoration: "none",
      transition: "transform .25s, border-color .25s",
    }}>
      <h3 style={{
        margin: "0 0 8px",
        fontSize: "18px",
        fontWeight: 700,
        color: "#FAFAFA",
      }}>{title}</h3>
      <p style={{
        margin: 0,
        fontSize: "14px",
        color: "#A1A1AA",
        lineHeight: 1.5,
      }}>{desc}</p>
    </Link>
  );
}

export default Home;