import { Mail, Lock, Delete } from "lucide-react";
import { useState } from "react";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";

const EditAccount = ({
  isEditOpen,
  setIsEditOpen,
  fullName,
  email,
  setEmail,
  selectedAccountId,
  setFullName,
  newPassword,
  setNewPassword,
  handleUpdateAccount,
  handleDeleteAccount,
}) => {
  const [passwordModal, setPasswordModal] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  if (!isEditOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 p-6 relative">
        {/* Close button */}
        <button
          onClick={() => setIsEditOpen(false)}
          className="cursor-pointer absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition"
        >
          ✕
        </button>

        {/* Modal header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Edit Account</h3>
          <p className="text-sm text-slate-500">
            You can only update the full name and password. Email is uneditable.
            <button
              onClick={() => setDeleteAccount(true)}
              className="bg-orange-600 ml-2 hover:bg-orange-500 cursor-pointer rounded-md text-slate-50 p-0.5 px-2"
            >
              Delete this account
            </button>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleUpdateAccount}>
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
                disabled
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100
								disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200"
              />
            </div>
          </label>
          {passwordModal && (
            <ChangePassword
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              setPasswordModal={setPasswordModal}
            />
          )}

          {deleteAccount && (
            <DeleteAccount
              deleteAccount={deleteAccount}
              setDeleteAccount={setDeleteAccount}
              fullName={fullName}
              selectedAccountId={selectedAccountId}
              handleDeleteAccount={handleDeleteAccount}
            />
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setPasswordModal(!passwordModal)}
              type="button"
              className="w-full cursor-pointer rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {passwordModal ? `Hide` : `Change Password`}
            </button>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Update Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccount;
