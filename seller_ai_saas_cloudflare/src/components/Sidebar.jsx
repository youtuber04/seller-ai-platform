
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Sparkles, Image, Video, Languages, ScanText, Megaphone,
  Search, Tags, BarChart3, Workflow, Ticket, CreditCard, Users, Shield, Settings
} from "lucide-react";
import { getDemoUser } from "../lib/api";

const ai = [
  ["/","대시보드", LayoutDashboard],
  ["/tool/product","AI 상품 추천", Sparkles],
  ["/tool/detail","AI 상세페이지 제작", Sparkles],
  ["/tool/review","AI 리뷰 요약", BarChart3],
  ["/tool/image","AI 이미지 생성", Image],
  ["/tool/video","AI 영상 생성", Video],
  ["/tool/translate","AI 번역", Languages],
  ["/tool/ocr","AI OCR", ScanText],
  ["/tool/copy","AI 마케팅 문구", Megaphone],
  ["/tool/seo","AI SEO 작성", Search],
  ["/tool/price","AI 가격 추천", Tags],
  ["/tool/data","AI 데이터 분석", BarChart3],
  ["/tool/automation","AI 업무 자동화", Workflow],
];

const admin = [
  ["/coupons","쿠폰 관리", Ticket],
  ["/billing","결제/요금제", CreditCard],
  ["/members","회원 관리", Users],
  ["/admin","관리자 페이지", Shield],
  ["/settings","API 설정", Settings],
];

export default function Sidebar(){
  const user = getDemoUser();
  const linkClass = ({isActive}) => isActive ? "active" : "";
  return <aside className="sidebar">
    <div className="logo"><div className="logoMark">S</div><div>Seller AI</div></div>
    <div className="userBox">
      <b>{user.plan} Plan</b>
      <span>{user.email}<br />잔여 {user.credits.toLocaleString()} 크레딧</span>
    </div>
    <nav className="nav">
      <div className="navTitle">AI 기능</div>
      {ai.map(([to,label,Icon]) => <NavLink key={to} to={to} className={linkClass}><Icon size={17}/>{label}</NavLink>)}
      <div className="navTitle">운영 관리</div>
      {admin.map(([to,label,Icon]) => <NavLink key={to} to={to} className={linkClass}><Icon size={17}/>{label}</NavLink>)}
    </nav>
  </aside>
}
