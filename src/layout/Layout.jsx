import { Outlet } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  const { loading } = useLoading();
  return (
    <div className="w-full min-h-screen bg-gray-100 ">
      {/* Centered content container */}
      {loading && <LoadingSpinner />}
      <ToastContainer position="top-right" theme="light" autoClose={3000} />

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
