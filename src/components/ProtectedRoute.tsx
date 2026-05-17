//  file:       src/components/ProtectedRoute.tsx


import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";   // , Outlet

interface Props {
  children: ReactNode;
}

    // Check login
    const ProtectedRoute = ({ children }: Props) => { 

        const token = localStorage.getItem("token");

        // const isAdmin = localStorage.getItem("is_admin");

        if (!token) {
            return <Navigate to="/" />;
            // return <Navigate to="/" replace />;
        }

        // if (isAdmin !== "1") {
        //     return <Navigate to="/menu" />; // or home
        // }

        return <>{children}</>;
    };

export default ProtectedRoute;

// DEMO 
// const ProtectedRoute = ({ children }: Props) => { 
//   // Check if user is logged in
//   let token = localStorage.getItem("token");

//   // DEV BYPASS: automatically login as admin if not logged in
//   if (!token) {
//     localStorage.setItem("username", "admin");
//     localStorage.setItem("token", "dev-token");
//     localStorage.setItem("is_admin", "1");

//     // update token variable so the rest of the code works
//     token = "dev-token";
//   }

//   // If token exists (real login or dev bypass), render children / outlet
//   if (token) {
//     return children ? <>{children}</> : <Outlet />;
//   }

//   // fallback (should never reach here with dev bypass)
//   return <Navigate to="/" replace />;
// };





