// Kimlik durumu yönetimi (React Context).
//
// Token localStorage'da tutulur; kullanıcı bilgisi /auth/me ile doğrulanır.
// 401 olursa oturum otomatik temizlenir (api.js dinleyicisi).
//
// Not: Context provider + useAuth hook'u aynı dosyada; fast-refresh uyarısı
// context dosyaları için kabul edilir bir istisnadır.
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";
import {
  api,
  clearTokens,
  getToken,
  setTokens,
  setUnauthorizedHandler,
} from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTok] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  // Açılışta token varsa doğrula.
  useEffect(() => {
    let iptal = false;
    async function dogrula() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const u = await api.me();
        if (!iptal) setUser(u);
      } catch {
        if (!iptal) {
          clearTokens();
          setTok(null);
          setUser(null);
        }
      } finally {
        if (!iptal) setLoading(false);
      }
    }
    dogrula();
    return () => {
      iptal = true;
    };
  }, []);

  // 401 -> oturumu düşür.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setTok(null);
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  async function girisYap(email, parola) {
    const tokenlar = await api.login(email, parola);
    setTokens(tokenlar);
    setTok(tokenlar.access_token);
    setUser(await api.me());
  }

  async function kayitOl(email, parola) {
    const tokenlar = await api.register(email, parola);
    setTokens(tokenlar);
    setTok(tokenlar.access_token);
    setUser(await api.me());
  }

  function cikisYap() {
    clearTokens();
    setTok(null);
    setUser(null);
  }

  const deger = {
    token,
    user,
    loading,
    isAuthenticated: !!token,
    girisYap,
    kayitOl,
    cikisYap,
  };

  return <AuthContext.Provider value={deger}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider içinde kullanılmalı.");
  return ctx;
}
