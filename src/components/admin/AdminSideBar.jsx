import React from "react";
import { X, LogOut, Bot, Clock, Settings, BookOpen, User } from "lucide-react";

const AdminSideBar = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  onLogout,
}) => {
  const tabs = [
    { id: "reviewer", label: "Uploaded Reviewer", icon: BookOpen },
    { id: "manage_account", label: "Manage Account", icon: User },

    { id: "ai", label: "AI Configuration", icon: Bot },
    { id: "history", label: "Log History", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 p-5 transition-transform duration-300 md:sticky md:top-24 md:translate-x-0 md:w-64 md:h-[calc(100vh-6rem)] md:overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between mb-6 md:hidden">
          <div>
            <p className="text-lg font-semibold text-slate-900">Navigation</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-slate-200"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-slate-200 md:mt-auto">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
