import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Features from "@/pages/features";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Dashboard from "@/pages/dashboard";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Features />} path="/features" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<Login />} path="/login" />
      <Route element={<Profile />} path="/profile" />
      <Route element={<Dashboard />} path="/dashboard" />
    </Routes>
  );
}

export default App;
