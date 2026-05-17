//  file:       src/components/ProtectedAdminRoute.tsx


import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }: any) => {
  const isAdmin = localStorage.getItem("is_admin");

  if (isAdmin !== "1") {
    return <Navigate to="/menu" />;
  }

  return children;
};

export default ProtectedAdminRoute;

