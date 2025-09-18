'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/signin');
      return;
    }

    if (!userLoading) {
      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.userType || '')) {
        router.replace('/unauthorized');
        return;
      }
      setIsLoading(false);
    }
  }, [router, user, userLoading, allowedRoles]);

  if (isLoading || userLoading) return <p className="text-center mt-20">Loading...</p>;

  return <>{children}</>;
}
