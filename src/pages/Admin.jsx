import React, { useEffect, useState } from "react";
import {
  Upload,
  X,
  Send,
  Paperclip,
  Plus,
  Trash2,
  Bot,
  Clock,
  Settings,
  BookOpen,
} from "lucide-react";
import Navbar from "../components/Navbar";
import MainLesson from "../components/lesson/MainLesson";



export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("lessons"); // 'lessons', 'ai', 'history', 'settings'

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

  const tabs = [
    { id: "lessons", label: "Uploaded Lessons", icon: BookOpen },
    { id: "ai", label: "AI Configuration", icon: Bot },
    { id: "history", label: "Log History", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-col md:flex-row gap-8 p-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-2 sticky top-24">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-slate-200"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* TAB 1: UPLOADED LESSONS */}
          {activeTab === "lessons" && <MainLesson />}

          {/* TAB 2: AI CONFIGURATION */}
          {activeTab === "ai" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <Bot className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Rule-Based AI Configuration
                    </h2>
                  </div>
                  <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>

                <p className="text-sm text-slate-500 mb-6">
                  Define exact question prompts and the response the AI
                  assistant should provide when an installer clicks them.
                </p>

                <form
                  onSubmit={handleAddRule}
                  className="space-y-4 mb-8 p-5 bg-purple-50/50 rounded-2xl border border-purple-100"
                >
                  <h3 className="text-sm font-semibold text-purple-800 flex items-center mb-2">
                    <Plus className="w-4 h-4 mr-1.5" /> Add New Rule
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Question Prompt
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm bg-white"
                      placeholder="e.g., What are the safety guidelines?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Bot Response
                    </label>
                    <textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm h-24 resize-none bg-white"
                      placeholder="Exact answer the bot should give..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm shadow-sm"
                  >
                    Save AI Rule
                  </button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
                    Active Rules ({botRules.length})
                  </h3>
                  {botRules.length === 0 && (
                    <p className="text-sm text-slate-400 italic">
                      No rules defined.
                    </p>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {botRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative group hover:border-purple-200 transition-colors"
                      >
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
                          title="Delete Rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="mb-2 pr-6">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Question Prompt:
                          </span>
                          <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
                            {rule.question}
                          </span>
                        </div>
                        <div className="mt-3">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Bot Reply:
                          </span>
                          <p className="text-sm text-slate-700 pl-3 border-l-2 border-purple-300 py-1 bg-purple-50/30 rounded-r-lg">
                            {rule.response}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOG HISTORY */}
          {activeTab === "history" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                <div className="bg-slate-100 p-2 rounded-lg mr-3">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                System Log History
              </h2>

              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    action: "Platform Settings updated",
                    user: "Admin",
                    time: "2 mins ago",
                    type: "system",
                  },
                  {
                    id: 2,
                    action:
                      'New AI Rule added: "How do I handle the power supply?"',
                    user: "Admin",
                    time: "1 hour ago",
                    type: "ai",
                  },
                  {
                    id: 3,
                    action: "Installer John Doe logged into the dashboard",
                    user: "System",
                    time: "3 hours ago",
                    type: "auth",
                  },
                  {
                    id: 4,
                    action:
                      'Review Material published: "Standard Operating Procedure v2.1"',
                    user: "Admin",
                    time: "1 day ago",
                    type: "content",
                  },
                ].map((log) => (
                  <div
                    key={log.id}
                    className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors -mx-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          log.type === "auth"
                            ? "bg-emerald-400"
                            : log.type === "ai"
                              ? "bg-purple-400"
                              : log.type === "content"
                                ? "bg-blue-400"
                                : "bg-slate-400"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {log.action}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Triggered by {log.user}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4 bg-slate-100 px-2 py-1 rounded-md">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                <div className="bg-slate-100 p-2 rounded-lg mr-3">
                  <Settings className="w-5 h-5 text-slate-600" />
                </div>
                Platform Settings
              </h2>

              <div className="space-y-8 max-w-xl">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">
                    General Profile
                  </h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value="ReviewLink Platform"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Admin Contact Email
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@reviewlink.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">
                    Preferences
                  </h3>
                  <div className="space-y-3 mt-4">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-800">
                        Email me when installers log in
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-800">
                        Send weekly digest of AI chatbot usage
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-800">
                        Require approval before materials are visible
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
