import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CVYukle from "./pages/CVYukle";
import IsIlani from "./pages/IsIlani";
import UyumAnalizi from "./pages/UyumAnalizi";
import MotivasyonMektubu from "./pages/MotivasyonMektubu";
import Gecmis from "./pages/Gecmis";
import Oneriler from "./pages/Oneriler";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Korumalı */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="cv" element={<CVYukle />} />
              <Route path="ilan" element={<IsIlani />} />
              <Route path="uyum" element={<UyumAnalizi />} />
              <Route path="mektup" element={<MotivasyonMektubu />} />
              <Route path="gecmis" element={<Gecmis />} />
              <Route path="oneriler" element={<Oneriler />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
