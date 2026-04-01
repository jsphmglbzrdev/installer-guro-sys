import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoading } from "../../context/LoadingContext";


const DeleteAccount = ({ fullName, deleteAccount, setDeleteAccount, handleDeleteAccount }) => {

  const [inputText, setInputText] = useState("");
  const [confirmText, setConfirmText] = useState(
    () => `${Math.random().toString(36).substring(2, 7)}-${fullName}`,
  );

  useEffect(() => {
    setConfirmText(`${Math.random().toString(36).substring(2, 7)}-${fullName}`);
    setInputText("");
  }, [fullName, deleteAccount]);

	const validateDeleteAccount = () => {
		if (inputText.trim() !== confirmText) {
			toast.error("Confirmation text does not match. Please enter the correct text to proceed.");
			return false;
		}
		handleDeleteAccount();
	}
  return (
    <div className="fixed h-full inset-0 z-60 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 p-6 relative">
        <div>
          <p className="text-sm text-slate-500">
            Are you sure you want to delete this account? This action cannot be
            undone. To confirm deletion, enter the text below on the input
            field.
          </p>
        </div>

        <div className="mt-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            required
            type="text"
            placeholder="Jane Doe"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2 text-sm">
          <div className=" text-slate-500"></div>
          <span className="text-orange-600 font-semibold">{confirmText}</span>
        </div>

        <div className="flex items-center gap-2 justify-center text-sm mt-2">
          {/* Close button */}
          <button
            onClick={() => setDeleteAccount(false)}
            className="cursor-pointer py-2 hover:bg-slate-200 bg-slate-100 w-full rounded-md text-slate-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => validateDeleteAccount()}
            className="hover:bg-orange-400 cursor-pointer py-2 w-full bg-orange-500 rounded-md text-slate-50 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
