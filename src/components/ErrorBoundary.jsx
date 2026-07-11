// Render sırasında beklenmeyen bir hata olursa tüm uygulamanın beyaz ekrana
// düşmesini önler; kullanıcıya anlaşılır bir mesaj + yeniden dene sunar.

import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hata: null };
  }

  static getDerivedStateFromError(hata) {
    return { hata };
  }

  componentDidCatch(hata, info) {
    // Gerçek projede burada bir hata izleme servisine (Sentry vb.) gönderilir.
    console.error("ErrorBoundary yakaladı:", hata, info);
  }

  render() {
    if (this.state.hata) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            background: "#0A0A0F",
            color: "#FAFAFA",
            fontFamily: "'Inter', sans-serif",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 800 }}>Bir şeyler ters gitti</h1>
          <p style={{ color: "#A1A1AA", maxWidth: "420px" }}>
            Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 28px",
              borderRadius: "12px",
              background: "linear-gradient(135deg,#6366F1,#A855F7)",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
