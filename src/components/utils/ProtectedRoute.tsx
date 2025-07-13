
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber">
        <div className="animate-pulse text-cesium">Loading...</div>
      </div>
    );
  }

  return user ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth" replace />
  );
};

export default ProtectedRoute;
