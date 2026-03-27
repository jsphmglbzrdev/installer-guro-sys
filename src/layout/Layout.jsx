import { Outlet } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Layout = () => {
	const { loading } = useLoading()
  return (
    <div className="w-full min-h-screen bg-gray-100 ">
      {/* Centered content container */}
			{loading && <LoadingSpinner/>}
      <div>
        <Outlet />
      </div>
   
    </div>
  );
};

export default Layout;