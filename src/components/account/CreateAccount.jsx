import { Mail, Lock } from "lucide-react";
const CreateAccount = ({ isOpen, setIsOpen, fullName, email, setEmail, password, setPassword, setFullName, handleCreateAccount}) => {

	if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 p-6 relative">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition"
        >
          ✕
        </button>

        {/* Modal header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Create new account
          </h3>
          <p className="text-sm text-slate-500">
            Ask for the full name, email address, and password to create a new
            installer account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleCreateAccount}>
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <div className="mt-2">
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email address
            <div className="mt-2 relative">
              <Mail className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <div className="mt-2 relative">
              <Lock className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
