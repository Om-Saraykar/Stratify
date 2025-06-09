import { Route, Routes, Navigate } from "react-router-dom";

// Non-dashboard pages
import IndexPage from "@/pages/index";
import Features from "@/pages/features";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
// Dashboard layout & child pages
import DashboardLayout from "@/pages/dashboard"; // ← This is your layout with Sidebar & Outlet
import NoteEditor from "@/pages/NoteEditor";
import TodoList from "@/pages/TodoList";
import Journal from "@/pages/Journal";
import CalendarView from "@/pages/CalendarView";
import SearchPage from "@/pages/SearchPage";
import SettingsPage from "@/pages/SettingsPage";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<IndexPage />} path="/" />
      <Route element={<Features />} path="/features" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<Login />} path="/login" />
      <Route element={<Profile />} path="/profile" />

      {/* Dashboard layout with nested children */}
      <Route element={<DashboardLayout />} path="/dashboard">
        <Route index element={<Navigate replace to="notes" />} />
        <Route element={<NoteEditor />} path="notes" />
        <Route element={<TodoList />} path="todo" />
        <Route element={<Journal />} path="journaling" />
        <Route element={<CalendarView />} path="calendar" />
        <Route element={<SearchPage />} path="search" />
        <Route element={<SettingsPage />} path="settings" />
      </Route>
    </Routes>
  );
}

export default App;
