import React, { useState } from "react";
import { Shield, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
// --- Inline Mock Dependencies to ensure the Canvas compiles successfully ---

import { useLoading } from "../context/LoadingContext";
import TextMessage from "../components/TextMessage";
import { signIn } from "../lib/auth";
// --- Main Application Component ---

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const { setLoading, isLoading } = useLoading();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        setType("error");
        setMessage(error.message);
      } else {
        setType("success");
        setMessage("Login Successfully!");
        console.log(data);
        const delay = setTimeout(() => {
          navigate("/admin");
        }, 2000);

        return () => clearTimeout(delay);
      }
    } catch (err) {
      console.error("Login error:", err);
      setType("error");

      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-orange-600 p-3 rounded-xl shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          InstallerGuro
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to the Dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all sm:text-sm"
                  placeholder="admin@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-md border border-slate-300 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all sm:text-sm"
                  placeholder="••••••••"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <TextMessage message={message} type={type} />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate("/home")}
                disabled={isLoading}
                className="w-full flex cursor-pointer justify-center items-center py-3 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Continue as an Installer
                <ArrowRight className="ml-2 w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
