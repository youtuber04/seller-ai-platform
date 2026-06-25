import Layout from "../components/Layout";
export default function Page(){
  return <Layout title="쿠폰 관리" subtitle="할인 쿠폰, 무료 체험 쿠폰, 크레딧 쿠폰을 생성합니다."><div className="grid2">
  <div className="card"><h3>쿠폰 생성</h3><label>쿠폰명</label><input placeholder="신규가입 30% 할인"/><label>쿠폰코드</label><input placeholder="WELCOME30"/><label>혜택</label><input placeholder="30% 또는 5000 크레딧"/><br/><br/><button className="btn">쿠폰 생성</button></div>
  <div className="card"><h3>쿠폰 목록</h3><table className="table"><tbody><tr><th>코드</th><th>혜택</th><th>사용</th></tr><tr><td>WELCOME30</td><td>30%</td><td>182</td></tr><tr><td>PROTRIAL</td><td>7일 무료</td><td>76</td></tr></tbody></table></div>
</div></Layout>
}
