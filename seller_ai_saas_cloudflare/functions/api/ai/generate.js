
import { json, readJson, uuid, demoUser } from "../../_utils.js";

const prompts = {
  product: "쇼핑몰 셀러를 위한 상품 추천 전략을 작성해줘.",
  detail: "한국 쇼핑몰 상세페이지 문구와 섹션 구성을 작성해줘.",
  review: "리뷰를 장점, 단점, 개선 포인트로 요약해줘.",
  image: "상세페이지/광고 이미지 생성을 위한 프롬프트를 작성해줘.",
  video: "쇼츠/릴스 광고 영상 대본과 컷 구성을 작성해줘.",
  translate: "상품 문구를 자연스러운 한국 쇼핑몰 문체로 번역해줘.",
  ocr: "OCR 추출 텍스트를 정리하고 상세페이지 문구로 재구성해줘.",
  copy: "마케팅 문구와 광고 카피를 작성해줘.",
  seo: "SEO 상품명, 키워드, 메타 설명을 작성해줘.",
  price: "원가와 경쟁가 기반 가격 전략을 제안해줘.",
  data: "쇼핑몰 데이터를 분석하고 개선 액션을 제안해줘.",
  automation: "셀러 업무 자동화 시나리오를 설계해줘."
};

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const user = await demoUser(env);
  const tool = body.tool || "detail";
  const usedCredits = tool === "image" || tool === "video" ? 150 : 80;

  let result = "";

  if (env.OPENAI_API_KEY) {
    const system = "너는 한국 쇼핑몰 셀러를 돕는 전문 AI 컨설턴트다. 결과는 실무자가 바로 복사해 사용할 수 있게 한국어로 작성한다.";
    const userPrompt = `${prompts[tool] || prompts.detail}\n\n입력값:\n${JSON.stringify(body.input, null, 2)}`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();
    result = data.choices?.[0]?.message?.content || "AI 응답을 가져오지 못했습니다.";
  } else {
    result = `[샘플 결과]\n\n${prompts[tool] || prompts.detail}\n\n상품명: ${body.input?.name || "입력 없음"}\n타깃: ${body.input?.target || "입력 없음"}\n\n1. 첫 화면 후킹 문구를 강화하세요.\n2. 상세페이지 상단에 핵심 장점 3가지를 배치하세요.\n3. 리뷰 요약과 쿠폰 혜택을 구매 버튼 근처에 노출하세요.\n\nOPENAI_API_KEY를 Cloudflare 환경변수에 등록하면 실제 AI 결과가 표시됩니다.`;
  }

  if (env.DB) {
    await env.DB.prepare(
      "INSERT INTO ai_jobs (id, user_id, tool, input, output, used_credits) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(uuid(), user.id, tool, JSON.stringify(body.input || {}), result, usedCredits).run();

    await env.DB.prepare(
      "UPDATE users SET credits = credits - ? WHERE id = ?"
    ).bind(usedCredits, user.id).run();
  }

  return json({
    ok: true,
    result,
    usedCredits
  });
}
