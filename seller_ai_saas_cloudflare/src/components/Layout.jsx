
import Sidebar from "./Sidebar";
import { getDemoUser } from "../lib/api";

export default function Layout({title, subtitle, children}){
  const user = getDemoUser();
  return <div className="app">
    <Sidebar />
    <main className="main">
      <div className="topbar">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="actions">
          <span className="badge">잔여 크레딧 {user.credits.toLocaleString()}</span>
          <button className="btn secondary">로그아웃</button>
          <button className="btn">업그레이드</button>
        </div>
      </div>
      {children}
    </main>
  </div>
}
