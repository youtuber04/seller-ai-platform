
import { useState } from "react";
import { api } from "../lib/api";

export default function AuthPage(){
  const [mode,setMode] = useState("login");
  const [form,setForm] = useState({email:"",password:"",businessName:""});
  const [msg,setMsg] = useState("");

  const submit = async () => {
    const path = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    try{
      const data = await api(path,{method:"POST",body:JSON.stringify(form)});
      setMsg(data.message || "처리되었습니다.");
      location.href = "/";
    }catch(e){
      setMsg(e.message);
    }
  };

  return <div className="auth">
    <div className="authCard">
      <div className="logo"><div className="logoMark">S</div><div>Seller AI</div></div>
      <h1>{mode === "login" ? "로그인" : "회원가입"}</h1>
      <p style={{color:"var(--muted)"}}>쇼핑몰 셀러를 위한 AI 업무 자동화 플랫폼</p>
      <div className="tabs">
        <button className={"tab "+(mode==="login"?"active":"")} onClick={()=>setMode("login")}>로그인</button>
        <button className={"tab "+(mode==="register"?"active":"")} onClick={()=>setMode("register")}>회원가입</button>
      </div>
      {mode === "register" && <>
        <label>상호명</label>
        <input value={form.businessName} onChange={e=>setForm({...form,businessName:e.target.value})} placeholder="예: 팡마켓" />
      </>}
      <label>이메일</label>
      <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="seller@email.com" />
      <label>비밀번호</label>
      <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="비밀번호" />
      <br/><br/>
      <button className="btn" onClick={submit}>{mode === "login" ? "로그인" : "회원가입"}</button>
      {msg && <p style={{marginTop:14,color:"var(--green-dark)",fontWeight:800}}>{msg}</p>}
    </div>
  </div>
}
