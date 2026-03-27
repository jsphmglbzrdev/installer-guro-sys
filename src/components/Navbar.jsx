import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { LogOut } from "lucide-react";
import { signOut } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

const Navbar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const handleLogout = () => {
    // Add your logout logic here (clear auth, redirect to login, etc.)
    setLoading(true);
    try {
      console.log("Logged out successfully!");
      setShowLogoutModal(false);
      signOut();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="text-2xl font-bold text-gray-900">InstallerGuro</div>
      <div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
      {/* Logout Confirmation Modal */}
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
};

export default Navbar;
