// Kimliği doğrulanmamış kullanıcıyı /login'e yönlendirir.

import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#A1A1AA", background: "#0A0A0F" }}>
        Yükleniyor...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
