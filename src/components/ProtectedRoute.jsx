import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, requiredRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/images" replace />;
  }

  return children;
}
