// Merkezi API istemcisi.
//
// Tüm backend çağrıları buradan geçer. Amaç:
// - Base URL tek yerde (env'den; sabit host yok).
// - Backend'in tutarlı hata sözleşmesini ({ error: { code, message } })
//   tek yerde çözümlemek; sayfalar sadece `ApiError.message` gösterir.
// - `res.ok` kontrolünü merkezileştirmek (HTTP 4xx/5xx artık sessizce
//   "başarı" sanılmaz).

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const TOKEN_KEY = "cc_token";
const REFRESH_KEY = "cc_refresh";

// --- Token deposu (localStorage) ---
function _get(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function _set(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // localStorage erişilemezse sessizce geç (ör. gizli mod).
  }
}

export const getToken = () => _get(TOKEN_KEY);
export const setToken = (t) => _set(TOKEN_KEY, t);
export const getRefreshToken = () => _get(REFRESH_KEY);
export const setRefreshToken = (t) => _set(REFRESH_KEY, t);

/** Her iki token'ı yazar (login/register/refresh sonrası). */
export function setTokens({ access_token, refresh_token }) {
  setToken(access_token);
  setRefreshToken(refresh_token);
}

/** Oturumu tamamen temizler. */
export function clearTokens() {
  setToken(null);
  setRefreshToken(null);
}

// Eşzamanlı 401'lerde tek bir refresh çağrısı yapılsın diye paylaşılan promise.
let _refreshPromise = null;
function _yenile() {
  if (!getRefreshToken()) return Promise.resolve(false);
  if (!_refreshPromise) {
    _refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: getRefreshToken() }),
        });
        if (!res.ok) return false;
        const veri = await res.json();
        setTokens(veri);
        return true;
      } catch {
        return false;
      } finally {
        _refreshPromise = null;
      }
    })();
  }
  return _refreshPromise;
}

// 401 olduğunda oturumu temizlemek için dinleyici (AuthProvider bağlanır).
let _onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  _onUnauthorized = fn;
}

export class ApiError extends Error {
  constructor(message, { code = "error", status = 0 } = {}) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

async function request(path, opts = {}, _yenilendiMi = false) {
  const { method = "GET", body, isForm = false } = opts;
  const headers = {};
  if (!isForm && body != null) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isForm ? body : body != null ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Ağ hatası / backend kapalı.
    throw new ApiError("Sunucuya ulaşılamadı. Backend çalışıyor mu?", {
      code: "network",
      status: 0,
    });
  }

  // 401: access token süresi dolmuş olabilir. Refresh token varsa BİR KEZ
  // yenileyip isteği tekrar dene (kullanıcı fark etmeden oturum sürer).
  if (
    res.status === 401 &&
    !_yenilendiMi &&
    path !== "/auth/refresh" &&
    getRefreshToken()
  ) {
    const ok = await _yenile();
    if (ok) return request(path, opts, true);
  }

  let veri = null;
  try {
    veri = await res.json();
  } catch {
    // Yanıt gövdesi JSON değil (ör. boş gövde) -> veri null kalır.
  }

  if (!res.ok) {
    // 401 ve yenileme de başarısız -> oturumu tamamen temizle.
    if (res.status === 401) {
      clearTokens();
      if (_onUnauthorized) _onUnauthorized();
    }
    // Yeni backend sözleşmesi: { error: { code, message } }.
    // Defansif: eski { hata } / FastAPI { detail } biçimlerini de yakala.
    const mesaj =
      veri?.error?.message ||
      veri?.hata ||
      (typeof veri?.detail === "string" ? veri.detail : null) ||
      `İstek başarısız (HTTP ${res.status}).`;
    const kod = veri?.error?.code || "error";
    throw new ApiError(mesaj, { code: kod, status: res.status });
  }

  return veri;
}

export const api = {
  // Auth
  register: (email, parola) =>
    request("/auth/register", { method: "POST", body: { email, parola } }),
  login: (email, parola) =>
    request("/auth/login", { method: "POST", body: { email, parola } }),
  me: () => request("/auth/me"),
  parolaDegistir: (eski_parola, yeni_parola) =>
    request("/auth/change-password", {
      method: "POST",
      body: { eski_parola, yeni_parola },
    }),

  // CV
  cvYukle(file) {
    const fd = new FormData();
    fd.append("dosya", file);
    return request("/cv-yukle", { method: "POST", body: fd, isForm: true });
  },
  cvGecmis: () => request("/cv-gecmis"),

  // İş ilanı
  ilanAnaliz: (metin) =>
    request("/is-ilani-analiz", { method: "POST", body: { metin } }),
  ilanlar: () => request("/is-ilanlari"),

  // Uyum
  uyumAnaliz: (cv_id, is_ilani_id) =>
    request("/uyum-analizi", { method: "POST", body: { cv_id, is_ilani_id } }),
  uyumGecmis: () => request("/uyum-analizi-gecmis"),

  // Mektup
  mektupUret: (cv_id, is_ilani_id) =>
    request("/motivasyon-mektubu", { method: "POST", body: { cv_id, is_ilani_id } }),
  mektupGecmis: () => request("/motivasyon-mektubu-gecmis"),

  // Öneriler
  isOnerileri: (cv_id) => request(`/is-onerileri/${cv_id}`),
};
