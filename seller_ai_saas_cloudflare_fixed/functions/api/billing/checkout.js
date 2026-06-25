
import { json, readJson, uuid, demoUser } from "../../_utils.js";

const plans = {
  starter: { amount: 29000, credits: 3000 },
  pro: { amount: 79000, credits: 15000 },
  business: { amount: 199000, credits: 50000 }
};

export async function onRequestPost({ request, env }) {
  const DB = env.DB || env.db;
  const body = await readJson(request);
  const user = await demoUser(env);
  const plan = body.plan || "pro";
  const selected = plans[plan] || plans.pro;

  if (DB) {
    await DB.prepare(
      "INSERT INTO payments (id, user_id, provider, plan, amount, status) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(uuid(), user.id, "sample", plan, selected.amount, "pending").run();
  }

  return json({
    ok: true,
    message: "결제 생성 샘플입니다. 토스페이먼츠/Stripe Secret Key 연결 후 checkoutUrl을 반환하세요.",
    checkoutUrl: null,
    plan,
    amount: selected.amount
  });
}
