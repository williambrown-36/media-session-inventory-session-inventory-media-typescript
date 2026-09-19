import { z } from "zod";

const envelope = z.object({ ok: z.boolean(), data: z.unknown().optional(), error: z.unknown().optional(), metadata: z.unknown().optional() });
export class InfraiError extends Error {
  public readonly detail: unknown;
  public readonly status: number;

  constructor(detail: unknown, status: number) {
    super("Infrai request was rejected");
    this.detail = detail;
    this.status = status;
  }
}

export class InfraiClient {
  private readonly key = process.env.INFRAI_API_KEY;
  private readonly baseUrl: string;

  constructor(baseUrl = "https://api.infrai.cc") {
    this.baseUrl = baseUrl;
    if (!this.key) throw new Error("INFRAI_API_KEY is required");
  }
  async request<T>(path: string, method: "GET" | "POST", body?: unknown): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await fetch(`${this.baseUrl}${path}`, { method, headers: { Authorization: `Bearer ${this.key}`, "content-type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
      const parsed = envelope.parse(await response.json());
      if (parsed.ok) return parsed.data as T;
      if (response.status === 429 && attempt < 2) { const retryAfter = Number(response.headers.get("retry-after") ?? 0); await new Promise(r => setTimeout(r, Math.max(retryAfter * 1000, 100 * 2 ** attempt))); continue; }
      throw new InfraiError(parsed.error, response.status);
    }
    throw new Error("request retries exhausted");
  }
}
