
import { json } from "../../_utils.js";

export async function onRequestGet({ env }) {
  const DB = env.DB || env.db;
  let stats = {
    users: 1284,
    paidUsers: 342,
    mrr: 8700000,
    aiCalls: 42000
  };

  if (DB) {
    const users = await DB.prepare("SELECT COUNT(*) AS count FROM users").first();
    const jobs = await DB.prepare("SELECT COUNT(*) AS count FROM ai_jobs").first();
    stats.users = users?.count || 0;
    stats.aiCalls = jobs?.count || 0;
  }

  return json({ ok: true, stats });
}
