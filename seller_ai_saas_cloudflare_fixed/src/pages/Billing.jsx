
import Layout from "../components/Layout";
import { api } from "../lib/api";

export default function Billing(){
  const checkout = async (plan) => {
    try{
      const data = await api("/api/billing/checkout",{method:"POST",body:JSON.stringify({plan})});
      alert(data.message || "결제 연결 준비 완료");
    }catch(e){ alert(e.message); }
  };

  return <Layout title="결제/요금제" subtitle="구독제와 크레딧 충전 결제 화면입니다.">
    <div className="grid">
      {[
        ["Starter","₩29,000","월 3,000 크레딧","starter"],
        ["Pro 추천","₩79,000","월 15,000 크레딧","pro"],
        ["Business","₩199,000","월 50,000 크레딧","business"]
      ].map(([name,price,desc,plan]) => <div className="card" key={plan}>
        <h3>{name}</h3><div className="metric">{price}</div><p>{desc}</p><br/>
        <button className="btn" onClick={()=>checkout(plan)}>선택</button>
      </div>)}
    </div>
    <br/>
    <div className="card">
      <h3>결제 내역</h3>
      <table className="table"><tbody>
        <tr><th>일자</th><th>상품</th><th>금액</th><th>상태</th></tr>
        <tr><td>2026-06-25</td><td>Pro 월 구독</td><td>₩79,000</td><td>결제완료</td></tr>
      </tbody></table>
    </div>
  </Layout>
}
