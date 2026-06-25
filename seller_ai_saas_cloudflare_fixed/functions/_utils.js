
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

export async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}

export function uuid() {
  return crypto.randomUUID();
}

export function requireEnv(env, key) {
  if (!env[key]) throw new Error(`${key} 환경변수가 필요합니다.`);
  return env[key];
}

export async function demoUser(env) {
  return {
    id: "demo-user",
    email: "seller@demo.com",
    plan: "pro",
    credits: 12430,
    role: "admin"
  };
}
