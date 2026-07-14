import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";
import Spinner from "../components/ui/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "student" | "client";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kama mtumiaji ana role tofauti na inayotakiwa kwenye hii page, mpeleke kwenye dashboard yake husika
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "client" ? "/dashboard/client" : "/dashboard/student"} replace />;
  }

  return <>{children}</>;
}