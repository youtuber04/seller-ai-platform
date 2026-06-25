
import { json, readJson, uuid } from "../../_utils.js";

export async function onRequestPost({ request, env }) {
  const DB = env.DB || env.db;
  const body = await readJson(request);
  if (!body.code || !body.name) return json({ error: "쿠폰명과 코드가 필요합니다." }, 400);

  if (DB) {
    await DB.prepare(
      "INSERT INTO coupons (id, code, name, discount_type, discount_value, credit_bonus, max_uses, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(uuid(), body.code, body.name, body.discountType || "percent", body.discountValue || 0, body.creditBonus || 0, body.maxUses || 0, body.expiresAt || null).run();
  }

  return json({ ok: true, message: "쿠폰 생성 완료" });
}
