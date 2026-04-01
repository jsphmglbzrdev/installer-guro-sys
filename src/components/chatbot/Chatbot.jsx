import React, { useState } from "react";
import { Bot, Save, LayoutTemplate, Plus, Trash2 } from "lucide-react";

export default function Chatbot() {
  // State for the chatbot configuration
  const [config, setConfig] = useState({
    botName: "SupportBot",
    greeting: "Hi there! How can I help you today?",
    qaPairs: [
      {
        id: 1,
        question: "I need help with my account.",
        response:
          "Sure thing! I can help you with your account. Could you please provide your account email address?",
      },
    ],
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  // Handle QA pair changes
  const handleQAChange = (id, field, value) => {
    setConfig((prev) => ({
      ...prev,
      qaPairs: prev.qaPairs.map((qa) =>
        qa.id === id ? { ...qa, [field]: value } : qa,
      ),
    }));
  };

  // Add a new QA pair
  const addQAPair = () => {
    setConfig((prev) => ({
      ...prev,
      qaPairs: [
        ...prev.qaPairs,
        { id: Date.now(), question: "", response: "" },
      ],
    }));
  };

  // Remove a QA pair
  const removeQAPair = (id) => {
    setConfig((prev) => ({
      ...prev,
      qaPairs: prev.qaPairs.filter((qa) => qa.id !== id),
    }));
  };

  // Mock save function
  const handleSave = () => {
    // In a real app, this would send data to an API
    console.log("Saved configuration:", config);
    alert("Configuration saved successfully!"); // Using alert for simple template demo, though custom modals are preferred in production.
  };

  return (
    <div>
      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
        {/* Configuration Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-orange-50">
            <LayoutTemplate className="text-orange-500" size={24} />
            <h2 className="text-lg font-semibold text-gray-800">
              Flow Configuration
            </h2>
          </div>

          <div className="space-y-6">
            {/* Basic Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Name
                </label>
                <input
                  type="text"
                  name="botName"
                  value={config.botName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="e.g. SalesBot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Welcome Greeting (Level 1)
                </label>
                <input
                  type="text"
                  name="greeting"
                  value={config.greeting}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="Initial message sent to users"
                />
              </div>
            </div>

            {/* Level 2 Configuration - Multiple Q&A */}
            <div className="pt-6 border-t border-orange-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-800">
                  Questions & Responses (Level 2)
                </h3>
                <button
                  onClick={addQAPair}
                  className="flex items-center gap-1 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <Plus size={16} />
                  Add Q&A
                </button>
              </div>

              <div className="space-y-6">
                {config.qaPairs.map((qa, index) => (
                  <div
                    key={qa.id}
                    className="bg-orange-50/50 rounded-xl p-5 border border-orange-100 relative mt-4"
                  >
                    <div className="absolute -top-3 left-4 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Pair {index + 1}
                    </div>

                    {config.qaPairs.length > 1 && (
                      <button
                        onClick={() => removeQAPair(qa.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove Question"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    <div className="space-y-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User's Main Question{" "}
                          <span className="text-gray-400 font-normal">
                            (What the user asks)
                          </span>
                        </label>
                        <input
                          type="text"
                          value={qa.question}
                          onChange={(e) =>
                            handleQAChange(qa.id, "question", e.target.value)
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                          placeholder="e.g. How do I reset my password?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bot's Response{" "}
                          <span className="text-gray-400 font-normal">
                            (How the bot replies)
                          </span>
                        </label>
                        <textarea
                          value={qa.response}
                          onChange={(e) =>
                            handleQAChange(qa.id, "response", e.target.value)
                          }
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                          placeholder="Enter the detailed response here..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
