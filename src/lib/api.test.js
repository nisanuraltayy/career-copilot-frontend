// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, ApiError, getRefreshToken, getToken, setToken, setTokens } from "./api";

describe("api client", () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function mockYanit({ ok = true, status = 200, body = {} }) {
    globalThis.fetch.mockResolvedValueOnce({
      ok,
      status,
      json: async () => body,
    });
  }

  it("başarılı yanıtı döndürür", async () => {
    mockYanit({ body: { toplam_donen: 0, kayitlar: [] } });
    const veri = await api.cvGecmis();
    expect(veri.toplam_donen).toBe(0);
  });

  it("{error:{code,message}} biçimini ApiError'a çevirir", async () => {
    mockYanit({
      ok: false,
      status: 404,
      body: { error: { code: "not_found", message: "CV bulunamadı." } },
    });
    await expect(api.cvGecmis()).rejects.toMatchObject({
      message: "CV bulunamadı.",
      code: "not_found",
      status: 404,
    });
  });

  it("token varsa Authorization başlığı ekler", async () => {
    setToken("abc123");
    mockYanit({ body: {} });
    await api.cvGecmis();
    const [, opts] = globalThis.fetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe("Bearer abc123");
  });

  it("401 alınca token temizlenir", async () => {
    setToken("eski-token");
    mockYanit({ ok: false, status: 401, body: { error: { code: "unauthorized", message: "x" } } });
    await expect(api.cvGecmis()).rejects.toBeInstanceOf(ApiError);
    expect(getToken()).toBeNull();
  });

  it("ağ hatasında dostça mesaj verir", async () => {
    globalThis.fetch.mockRejectedValueOnce(new TypeError("failed"));
    await expect(api.cvGecmis()).rejects.toMatchObject({ code: "network" });
  });

  it("401'de refresh ile yeniler ve isteği tekrar dener", async () => {
    setTokens({ access_token: "eski", refresh_token: "r1" });
    globalThis.fetch
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ error: { code: "unauthorized", message: "x" } }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ access_token: "yeni", refresh_token: "r2" }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ toplam_donen: 5 }) });

    const veri = await api.cvGecmis();
    expect(veri.toplam_donen).toBe(5);
    expect(getToken()).toBe("yeni");
    expect(getRefreshToken()).toBe("r2");
  });

  it("refresh başarısızsa oturum temizlenir", async () => {
    setTokens({ access_token: "eski", refresh_token: "r1" });
    globalThis.fetch
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ error: { code: "unauthorized", message: "x" } }) })
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) });

    await expect(api.cvGecmis()).rejects.toBeInstanceOf(ApiError);
    expect(getToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it("login token'ı body ile gönderir", async () => {
    mockYanit({ body: { access_token: "t", token_type: "bearer" } });
    const r = await api.login("a@b.com", "parola12345");
    expect(r.access_token).toBe("t");
    const [url, opts] = globalThis.fetch.mock.calls[0];
    expect(url).toContain("/auth/login");
    expect(JSON.parse(opts.body)).toEqual({ email: "a@b.com", parola: "parola12345" });
  });
});
