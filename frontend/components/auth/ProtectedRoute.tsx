'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/signin'); // redirect to login if not logged in
    } else {
      setIsLoading(false); // token exists, show dashboard
    }
  }, [router]);

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;

  return <>{children}</>;
}
