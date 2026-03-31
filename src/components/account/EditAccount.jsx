import React from "react";

const EditAccount = ({ email, full_name }) => {
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Create new account
          </h3>
          <p className="text-sm text-slate-500">
            Ask for the full name, email address, and password to create a new
            installer account.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleCreateAccount}>
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <div className="mt-2">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email address
            <div className="mt-2 relative">
              <Mail className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <div className="mt-2 relative">
              <Lock className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </label>

          {status && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                status.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAccount;
