import { Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "react";
import SignInPage from "./pages/SignInPage";
import { useAuth } from "./contexts/AuthContext";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : children;
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/signin" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
      <Route path="/signin" element={<PublicRoute><SignInPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}