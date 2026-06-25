
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import ToolPage from "./pages/ToolPage";
import Billing from "./pages/Billing";
import Coupons from "./pages/Coupons";
import Members from "./pages/Members";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";

function App(){
  return <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/tool/product" element={<ToolPage type="product" />} />
      <Route path="/tool/detail" element={<ToolPage type="detail" />} />
      <Route path="/tool/review" element={<ToolPage type="review" />} />
      <Route path="/tool/image" element={<ToolPage type="image" />} />
      <Route path="/tool/video" element={<ToolPage type="video" />} />
      <Route path="/tool/translate" element={<ToolPage type="translate" />} />
      <Route path="/tool/ocr" element={<ToolPage type="ocr" />} />
      <Route path="/tool/copy" element={<ToolPage type="copy" />} />
      <Route path="/tool/seo" element={<ToolPage type="seo" />} />
      <Route path="/tool/price" element={<ToolPage type="price" />} />
      <Route path="/tool/data" element={<ToolPage type="data" />} />
      <Route path="/tool/automation" element={<ToolPage type="automation" />} />
      <Route path="/coupons" element={<Coupons />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/members" element={<Members />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </BrowserRouter>
}

createRoot(document.getElementById("root")).render(<App />);
