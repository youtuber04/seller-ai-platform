
export async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "API 요청 실패");
  return data;
}

export function getDemoUser() {
  return {
    email: "seller@demo.com",
    businessName: "팡마켓",
    plan: "Pro",
    credits: 12430,
    role: "admin"
  };
}
