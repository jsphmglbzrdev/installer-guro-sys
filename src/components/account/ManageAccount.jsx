import { useEffect, useState } from "react";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import { useLoading } from "../../context/LoadingContext";
import { toast } from "react-toastify";
import {
  fetchAllAdminAccounts,
  getCurrentSession,
  updateAccountDetails,
  deleteAccount,
  signUp,
} from "../../lib/auth";
import CreateAccount from "./CreateAccount";
import EditAccount from "./EditAccount";

const ManageAccount = () => {
  const { setLoading } = useLoading();
  const [accounts, setAccounts] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [activeUserEmail, setActiveUserEmail] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signUp(email, password, fullName, "Admin");
			if(error) return console.log(error)
      console.log("Auth data:", data);

      toast.success("Account created successfully!");
      setIsOpen(false);
      setEmail("");
      setPassword("");
      setFullName("");
      fetchAccounts();
    } catch (err) {
      console.error("Account creation error:", err);
      toast.error(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);

    try {
      const { data, error } = await fetchAllAdminAccounts();
      if (error) {
        toast.error("Failed to fetch accounts. Please try again.");
        console.error("Fetch accounts error:", error);
        return;
      }

      setAccounts(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSession = async () => {
    try {
      const { data, error } = await getCurrentSession();
      if (error) {
        console.error("Fetch session error:", error);
        return;
      }

      const session = data?.session;
      if (session?.user) {
        setActiveUserId(session.user.id);
        setActiveUserEmail(session.user.email || "");
      }
    } catch (err) {
      console.error("Fetch active session failed:", err);
    }
  };

  const viewUserDetails = (id) => {
    const selectedUser = accounts.find((account) => account.id === id);
    if (selectedUser) {
      setSelectedAccountId(selectedUser.id);
      setIsEditOpen(true);
      console.log("Selected user for editing:", selectedUser);
      setFullName(selectedUser.full_name);
      setEmail(selectedUser.email);
    }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName.trim() && !newPassword.trim()) {
      toast.error("Please provide a full name or new password to update.");
      setLoading(false);
      return;
    }

    try {
      await updateAccountDetails(selectedAccountId, fullName, newPassword);
      toast.success("Account updated successfully.");
      setNewPassword("");
      setSelectedAccountId(null);
      fetchAccounts();
    } catch (err) {
      console.error("Update account error:", err);
      setIsEditOpen(false);
      toast.error(err.message || "Failed to update account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccountId) {
      toast.error("No account selected to delete.");
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(selectedAccountId);
      setSelectedAccountId(null);
      setFullName("");
      setEmail("");
      setNewPassword("");
      setIsEditOpen(false);
      fetchAccounts();
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error(err.message || "Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchActiveSession();
  }, []);

  useEffect(() => {
    console.log("Create modal open state changed:", isOpen);
    if (isEditOpen === false) {
      setFullName("");
      setEmail("");
      setPassword("");
    }
  }, [isEditOpen]);
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Account Management
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Manage user accounts
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl">
              Create new installer accounts, review existing users, and keep
              your team organized.
            </p>
            {activeUserEmail && (
              <p className="mt-2 text-sm text-slate-500">
                Logged in as:{" "}
                <span className="font-semibold text-slate-700">
                  {activeUserEmail}
                </span>
              </p>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mt-4 cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              Create new account
            </button>
          </div>
        </div>
      </div>

      {/* Display all accounts registered */}
      <div className="grid gap-6 ">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                All accounts
              </h3>
              <p className="text-sm text-slate-500">
                Current accounts created in this portal.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <User className="w-3.5 h-3.5" /> {accounts.length}
            </span>
          </div>

          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                onClick={() => viewUserDetails(account.id)}
                className="rounded-2xl border cursor-pointer border-slate-200 p-4 hover:border-orange-200 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {account.full_name} -{" "}
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {account.role}{" "}
                        {(activeUserId === account.id ||
                          activeUserEmail === account.email) && (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                            Active
                          </span>
                        )}
                      </span>
                    </p>
                    <p className="text-sm text-slate-500">{account.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create account component */}
      <CreateAccount
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fullName={fullName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        setFullName={setFullName}
        handleCreateAccount={handleCreateAccount}
      />

      <EditAccount
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        fullName={fullName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        setFullName={setFullName}
        selectedAccountId={selectedAccountId}
        handleDeleteAccount={handleDeleteAccount}
        handleUpdateAccount={handleUpdateAccount} // Reusing the same handler for simplicity, ideally should be a separate update handler
      />
    </div>
  );
};

export default ManageAccount;
