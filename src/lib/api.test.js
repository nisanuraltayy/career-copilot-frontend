// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, ApiError, getToken, setToken } from "./api";

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

  it("login token'ı body ile gönderir", async () => {
    mockYanit({ body: { access_token: "t", token_type: "bearer" } });
    const r = await api.login("a@b.com", "parola12345");
    expect(r.access_token).toBe("t");
    const [url, opts] = globalThis.fetch.mock.calls[0];
    expect(url).toContain("/auth/login");
    expect(JSON.parse(opts.body)).toEqual({ email: "a@b.com", parola: "parola12345" });
  });
});
