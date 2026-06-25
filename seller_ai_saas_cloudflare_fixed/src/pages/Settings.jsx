import Layout from "../components/Layout";
export default function Page(){
  return <Layout title="API 설정" subtitle="OpenAI, 결제, DB, 파일 저장소 연결 설정 화면입니다."><div className="grid2"><div className="card"><h3>환경변수</h3><p>Cloudflare Dashboard 또는 wrangler secret으로 등록하세요.</p><br/><div className="notice">OPENAI_API_KEY / JWT_SECRET / TOSS_SECRET_KEY / STRIPE_SECRET_KEY</div></div><div className="card"><h3>바인딩</h3><table className="table"><tbody><tr><th>서비스</th><th>바인딩</th></tr><tr><td>D1</td><td>DB</td></tr><tr><td>R2</td><td>FILES</td></tr></tbody></table></div></div></Layout>
}
