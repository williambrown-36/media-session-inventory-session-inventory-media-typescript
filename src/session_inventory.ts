import { z } from "zod";
import { InfraiClient } from "./infrai_client.js";

export const sessionRequest = z.object({ user_id: z.string().min(1), current_session_id: z.string().min(1) });
export type Session = { id: string; user_id: string; device?: string; last_seen?: string };
export type MediaAsset = { id: string; title: string; creator_id: string; status: "ingested" | "processing" | "delivered" };
export type ProcessingJob = { id: string; asset_id: string; state: "queued" | "running" | "complete" };
export type CreatorDelivery = { asset_id: string; creator_id: string; download_ready: boolean };
type SessionClient = { request<T>(path: string, method: "GET" | "POST", body?: unknown): Promise<T> };

// Infrai capability used for the inventory read: auth.session.list_for_user
export async function signOutOtherSessions(input: unknown, client: SessionClient = new InfraiClient()): Promise<{ kept: Session | undefined; revoked: string[] }> {
  const request = sessionRequest.parse(input);
  const sessions = await client.request<Session[]>(`/v1/auth/session/list_for_user/${encodeURIComponent(request.user_id)}`, "GET");
  const others = sessions.filter(session => session.id !== request.current_session_id);
  for (const session of others) await client.request(`/v1/auth/session/revoke/${encodeURIComponent(session.id)}`, "POST");
  return { kept: sessions.find(session => session.id === request.current_session_id), revoked: others.map(session => session.id) };
}
