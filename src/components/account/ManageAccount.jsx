import { useEffect, useState } from "react";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import { useLoading } from "../../context/LoadingContext";
import { toast } from "react-toastify";
import { signUp, fetchAllAdminAccounts, getCurrentSession } from "../../lib/auth";

const ManageAccount = () => {
	
	

  const { setLoading } = useLoading();
  const [accounts, setAccounts] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [activeUserEmail, setActiveUserEmail] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const handleCreateAccount = async (e) => {

    e.preventDefault();
    setLoading(true);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { authData, profileData } = await signUp(
        email,
        password,
        fullName,
        "Admin",
      );

      console.log("Auth data:", authData);
      console.log("Profile data:", profileData);

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

		try{
			const { data, error} = await fetchAllAdminAccounts();
			if(error){
				toast.error("Failed to fetch accounts. Please try again.");
				console.error("Fetch accounts error:", error);
				return;
			}

			setAccounts(data);
		}finally{
			setLoading(false);
		}
		
	}

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

	useEffect(() => {
		fetchAccounts();
		fetchActiveSession();
	}, [])
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
                Logged in as: <span className="font-semibold text-slate-700">{activeUserEmail}</span>
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
                className="rounded-2xl border border-slate-200 p-4 hover:border-orange-200 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {account.full_name} - <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {account.role} -  {(activeUserId === account.id || activeUserEmail === account.email) && (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        Active
                      </span>
                    )}
                    </span>
                    </p>
                    <p className="text-sm text-slate-500">{account.email}</p>
										<p className="text-sm text-slate-500">Date Created : {account.created_at ? new Date(account.created_at).toLocaleDateString() : ""}</p>
                  </div>
                  <div className="flex items-center flex-col ">
                  
                   
										<div>
											<button className="text-xs rounded-md bg-orange-600 cursor-pointer hover:bg-orange-500 text-white py-2 px-5">Edit</button>
										</div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create account */}
      {isOpen && (
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
                Ask for the full name, email address, and password to create a
                new installer account.
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
      )}
    </div>
  );
};

export default ManageAccount;
