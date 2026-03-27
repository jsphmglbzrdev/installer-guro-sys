import { Routes, Route, useNavigate } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import InstallerHome from "./pages/InstallerHome";
import Layout from "./layout/Layout";
import Admin from "./pages/Admin";
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route
            path="/"
            element={session ? <Navigate to="/admin" /> : <LoginScreen />}
          />

          {/* Protected */}
          <Route path="/home" element={<InstallerHome />} />
          <Route path="/home/reviewer/:id" element={<InstallerHome />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute session={session}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
