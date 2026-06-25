
import { useState } from "react";
import Layout from "../components/Layout";
import { api } from "../lib/api";

const config = {
  product: ["AI 상품 추천", "타깃 고객과 카테고리를 입력하면 상품 아이디어를 추천합니다.", "상품 추천 생성"],
  detail: ["AI 상세페이지 제작", "상품 정보를 입력하면 상세페이지 문구와 섹션 구성을 만듭니다.", "상세페이지 생성"],
  review: ["AI 리뷰 요약", "리뷰를 입력하면 장점, 단점, 개선 포인트를 요약합니다.", "리뷰 요약"],
  image: ["AI 이미지 생성", "광고 이미지와 상세페이지 이미지 프롬프트를 만듭니다.", "이미지 프롬프트 생성"],
  video: ["AI 영상 생성", "쇼츠, 릴스, 광고 영상 대본과 컷 구성을 만듭니다.", "영상 기획 생성"],
  translate: ["AI 번역", "중국어, 영어, 일본어 문구를 한국 쇼핑몰 톤으로 번역합니다.", "번역하기"],
  ocr: ["AI OCR", "이미지 속 텍스트 추출과 번역을 준비합니다.", "OCR 분석"],
  copy: ["AI 마케팅 문구", "블로그, 광고, 인스타, 유튜브 카피를 생성합니다.", "마케팅 문구 생성"],
  seo: ["AI SEO 작성", "상품명, 키워드, 메타 설명을 최적화합니다.", "SEO 생성"],
  price: ["AI 가격 추천", "원가와 경쟁가를 바탕으로 적정 판매가를 추천합니다.", "가격 추천"],
  data: ["AI 데이터 분석", "방문자, 전환율, 매출 데이터를 분석합니다.", "데이터 분석"],
  automation: ["AI 업무 자동화", "주문, 문의, 쿠폰, 리뷰 자동화 시나리오를 만듭니다.", "자동화 설계"],
};

export default function ToolPage({type}){
  const [title, subtitle, button] = config[type] || config.detail;
  const [form, setForm] = useState({name:"", target:"", detail:""});
  const [result, setResult] = useState("입력 후 생성 버튼을 누르면 AI 결과가 표시됩니다.");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try{
      const data = await api("/api/ai/generate", {
        method:"POST",
        body: JSON.stringify({ tool:type, input:form })
      });
      setResult(data.result || "결과가 없습니다.");
    }catch(e){
      setResult("API 연결 전입니다. Cloudflare 환경변수와 D1 설정 후 실제 AI 결과가 표시됩니다.\\n\\n" + e.message);
    }finally{
      setLoading(false);
    }
  };

  return <Layout title={title} subtitle={subtitle}>
    <div className="tabs">
      <div className="tab active">기본 생성</div>
      <div className="tab">템플릿</div>
      <div className="tab">저장 결과</div>
      <div className="tab">사용량</div>
    </div>
    <div className="grid2">
      <section className="card">
        <h3>{title} 입력</h3>
        <label>상품명 / 작업명</label>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="예: 달걀 계란 자동 디스펜서 30구 3단형" />
        <label>타깃 / 판매 채널</label>
        <input value={form.target} onChange={e=>setForm({...form,target:e.target.value})} placeholder="예: 30대 주부, 스마트스토어, 쿠팡" />
        <label>상세 내용</label>
        <textarea value={form.detail} onChange={e=>setForm({...form,detail:e.target.value})} placeholder="제품 스펙, 장점, 리뷰, 경쟁사 가격, 원하는 톤 등을 입력하세요." />
        <br/><br/>
        <button className="btn" onClick={submit} disabled={loading}>{loading ? "생성 중..." : button}</button>
        <button className="btn secondary" style={{marginLeft:8}}>결과 저장</button>
        <p style={{marginTop:12,color:"var(--muted)",fontSize:13}}>예상 차감 크레딧: 30~150</p>
      </section>
      <section className="card">
        <h3>AI 결과</h3>
        <div className="result">{result}</div>
      </section>
    </div>
  </Layout>
}
