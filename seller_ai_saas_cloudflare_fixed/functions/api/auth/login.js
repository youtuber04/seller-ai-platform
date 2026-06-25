
import { json, readJson, uuid } from "../../_utils.js";

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body.email || !body.password) return json({ error: "이메일과 비밀번호가 필요합니다." }, 400);

  const token = uuid();

  return json({
    ok: true,
    message: "로그인 성공. 실제 서비스에서는 세션 쿠키/JWT 검증을 연결하세요.",
    token,
    user: {
      email: body.email,
      plan: "pro",
      credits: 12430
    }
  });
}
