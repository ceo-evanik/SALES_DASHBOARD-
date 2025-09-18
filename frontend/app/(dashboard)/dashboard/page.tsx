import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardPageComponent from '@/components/dash';
import BillingPage from '@/components/billing';
import ReportPage from '@/components/reports';

export default function MainPage() {   // <-- rename local function
  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <DashboardPageComponent />
      <BillingPage />
      <ReportPage />
    </ProtectedRoute>
  );
}
