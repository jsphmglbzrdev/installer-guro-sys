import { Menu } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";


const AdminNavbar = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="text-2xl font-bold text-gray-900">InstallerGuro</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">
            {user?.user_metadata?.full_name || "Loading..."}
          </p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
