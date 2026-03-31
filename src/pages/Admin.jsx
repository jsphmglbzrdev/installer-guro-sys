import React, { use, useEffect, useState } from "react";
import { Plus, Trash2, Bot, Clock, Settings, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import ConfirmationModal from "../components/ConfirmationModal";
import MainLesson from "../components/lesson/MainLesson";
import { signOut } from "../lib/auth";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSideBar from "../components/admin/AdminSideBar";
import ManageAccount from "../components/account/ManageAccount";
import LogHistory from "../components/log-history/LogHistory";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminActiveTab") || "reviewer";
    }
    return "reviewer";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      setShowLogoutModal(false);
      await signOut();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminActiveTab", activeTab);
    }
  }, [activeTab]);

  // Material Form State

  // Rule Form State
  const [newQuestion, setNewQuestion] = useState("");
  const [newResponse, setNewResponse] = useState("");

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newQuestion || !newResponse) return;

    setBotRules([
      { id: Date.now(), question: newQuestion, response: newResponse },
      ...botRules,
    ]);
    setNewQuestion("");
    setNewResponse("");
  };

  const handleDeleteRule = (id) => {
    setBotRules(botRules.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navbar */}
      <AdminNavbar onMenuToggle={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex flex-col md:flex-row gap-8 p-6">
        <AdminSideBar
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            closeSidebar();
          }}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onLogout={() => setShowLogoutModal(true)}
        />
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* TAB 1: UPLOADED LESSONS */}
          {activeTab === "reviewer" && <MainLesson />}

          {activeTab === "manage_account" && <ManageAccount />}

          {/* TAB 2: AI CONFIGURATION */}
          {activeTab === "ai" && <Chatbot />}

          {/* TAB 3: LOG HISTORY */}
          {activeTab === "history" && <LogHistory />}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && <Settings />}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        headingText="Logout from Admin Panel?"
        message="Are you sure you want to logout? You'll need to sign in again to access this dashboard."
        buttonTxt="Logout"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
