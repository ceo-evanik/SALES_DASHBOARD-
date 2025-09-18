
import { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface UeserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UeserLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
     
        <div>
          {children}
        </div>
  
    </ProtectedRoute>
  );
}
