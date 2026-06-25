import Layout from "../components/Layout";
export default function Page(){
  return <Layout title="회원 관리" subtitle="가입자, 요금제, 크레딧, 상태를 관리합니다."><div className="card"><h3>회원 목록</h3><table className="table"><tbody><tr><th>이메일</th><th>상호명</th><th>요금제</th><th>크레딧</th><th>상태</th></tr><tr><td>seller01@email.com</td><td>팡마켓</td><td>Pro</td><td>12,430</td><td>정상</td></tr><tr><td>seller02@email.com</td><td>그린셀러</td><td>Starter</td><td>2,100</td><td>정상</td></tr></tbody></table></div></Layout>
}
