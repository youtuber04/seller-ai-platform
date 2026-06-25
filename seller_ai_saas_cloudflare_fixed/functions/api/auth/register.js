
import { json, readJson, uuid } from "../../_utils.js";

export async function onRequestPost({ request, env }) {
  const DB = env.DB || env.db;
  const body = await readJson(request);
  if (!body.email || !body.password) return json({ error: "이메일과 비밀번호가 필요합니다." }, 400);

  const userId = uuid();

  if (DB) {
    await DB.prepare(
      "INSERT INTO users (id, email, business_name, plan, credits) VALUES (?, ?, ?, 'trial', 500)"
    ).bind(userId, body.email, body.businessName || "").run();
  }

  return json({
    ok: true,
    message: "회원가입 완료. 실제 서비스에서는 비밀번호 해시와 이메일 인증을 추가하세요.",
    userId
  });
}
