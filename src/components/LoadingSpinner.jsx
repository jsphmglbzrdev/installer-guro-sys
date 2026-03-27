import { PuffLoader } from "react-spinners";
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/5 backdrop-blur-xs z-50">
      <PuffLoader color="#ff9f00" size={50} />
    </div>
  );
};

export default LoadingSpinner;
