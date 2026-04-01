import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const ChangePassword = ({
  passwordModal,
  setPasswordModal,
  newPassword,
  setNewPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="block text-sm font-medium text-slate-700">
      New Password
      <div className="mt-2 relative">
        <Lock className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />

        <input
          required
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />

        {/* Eye Icon */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="cursor-pointer absolute right-4 top-3.5 text-slate-400"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </label>
  );
};

export default ChangePassword;
