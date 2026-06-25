
import Layout from "../components/Layout";

export default function Dashboard(){
  return <Layout title="대시보드" subtitle="쇼핑몰 셀러 AI 플랫폼 운영 현황">
    <div className="grid4">
      <div className="card"><h3>오늘 AI 생성</h3><div className="metric">128</div><p>어제 대비 +18%</p></div>
      <div className="card"><h3>월 반복 매출</h3><div className="metric">₩8.7M</div><p>구독 결제 기준</p></div>
      <div className="card"><h3>활성 회원</h3><div className="metric">342</div><p>유료 회원 128명</p></div>
      <div className="card"><h3>API 상태</h3><div className="metric">준비</div><p>OpenAI / D1 / 결제 연결</p></div>
    </div>
    <br/>
    <div className="grid2">
      <div className="card">
        <h3>실서비스형 구조</h3>
        <table className="table">
          <tbody>
            <tr><th>영역</th><th>구현 방식</th><th>상태</th></tr>
            <tr><td>프론트엔드</td><td>React + Vite</td><td>완료</td></tr>
            <tr><td>서버</td><td>Cloudflare Pages Functions</td><td>완료</td></tr>
            <tr><td>DB</td><td>Cloudflare D1 Schema</td><td>완료</td></tr>
            <tr><td>AI</td><td>OpenAI API 연결 엔드포인트</td><td>준비</td></tr>
            <tr><td>파일</td><td>Cloudflare R2 바인딩</td><td>준비</td></tr>
            <tr><td>결제</td><td>토스/Stripe 연결 구조</td><td>준비</td></tr>
          </tbody>
        </table>
      </div>
      <div className="card soft">
        <h3>다음 작업</h3>
        <p>Cloudflare에서 D1 데이터베이스 생성 후 schema.sql을 실행하고, OPENAI_API_KEY를 환경변수로 넣으면 AI 생성 API부터 실제 연결할 수 있습니다.</p>
        <br/>
        <div className="notice">API 키는 절대 프론트엔드에 넣지 말고 Cloudflare 환경변수에 저장해야 합니다.</div>
      </div>
    </div>
  </Layout>
}
