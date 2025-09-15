import ProtectedRoute from '@/components/auth/ProtectedRoute'; 
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <h1>Dashboard content</h1>
    </ProtectedRoute>
  );
}
