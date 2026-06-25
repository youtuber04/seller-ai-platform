import Layout from "../components/Layout";
export default function Page(){
  return <Layout title="관리자 페이지" subtitle="매출, 회원, 쿠폰, AI 사용량을 통합 관리합니다."><div className="grid4"><div className="card"><h3>월 매출</h3><div className="metric">₩8.7M</div></div><div className="card"><h3>AI 호출</h3><div className="metric">42K</div></div><div className="card"><h3>회원</h3><div className="metric">1,284</div></div><div className="card"><h3>전환율</h3><div className="metric">28%</div></div></div><br/><div className="card"><h3>AI 기능별 사용량</h3><table className="table"><tbody><tr><th>기능</th><th>호출</th><th>크레딧</th></tr><tr><td>상세페이지</td><td>12,840</td><td>1,284,000</td></tr><tr><td>SEO</td><td>9,120</td><td>456,000</td></tr></tbody></table></div></Layout>
}
