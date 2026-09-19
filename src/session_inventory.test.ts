import assert from "node:assert/strict";
import { signOutOtherSessions } from "./session_inventory.js";

const calls: string[] = [];
const client = { request: async <T>(path: string, _method: "GET" | "POST") => { calls.push(path); return (path.includes("list_for_user") ? [{ id: "current", user_id: "u" }, { id: "tablet", user_id: "u" }] : undefined) as T; } };
const result = await signOutOtherSessions({ user_id: "u", current_session_id: "current" }, client);
assert.deepEqual(result.revoked, ["tablet"]);
assert.deepEqual(calls, ["/v1/auth/session/list_for_user/u", "/v1/auth/session/revoke/tablet"]);
console.log("kept current session and revoked tablet");
