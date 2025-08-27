import { Navigate } from "react-router-dom";
import { useCheckAuth } from "../../hooks/authHook";

type Props = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: Props) => {
  const { authenticated, loading } = useCheckAuth();

  if (loading === false && authenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authenticated === false) return <Navigate to="/auth" replace />;

  return children;
};

export default ProtectedRoute;
