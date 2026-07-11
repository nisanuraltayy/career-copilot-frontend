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

// --- Token deposu (localStorage) ---
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage erişilemezse sessizce geç (ör. gizli mod).
  }
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

async function request(path, { method = "GET", body, isForm = false } = {}) {
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

  let veri = null;
  try {
    veri = await res.json();
  } catch {
    // Yanıt gövdesi JSON değil (ör. boş gövde) -> veri null kalır.
  }

  if (!res.ok) {
    // 401: token geçersiz/süresi dolmuş -> oturumu temizle.
    if (res.status === 401) {
      setToken(null);
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
