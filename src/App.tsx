
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { FallbackState } from '@/components/ui/fallback-state';
import { DashboardLayout } from '@/features/layout/components';

// Importando páginas das features
const Index = lazy(() => import('@/features/core/pages/Index'));
const NotFound = lazy(() => import('@/features/core/pages/NotFound'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const AuthCallbackPage = lazy(() => import('@/features/auth/pages/AuthCallbackPage'));
const EmailVerificationPage = lazy(() => import('@/features/auth/pages/EmailVerificationPage'));
const UnauthorizedPage = lazy(() => import('@/features/auth/pages/UnauthorizedPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const AdminPage = lazy(() => import('@/features/admin/pages/AdminPage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/pages/AnalyticsPage'));
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const SustainabilityPage = lazy(() => import('@/features/sustainability/pages/SustainabilityPage'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSkeleton variant="page" />
        </div>
      }>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Rotas protegidas - usando o layout do dashboard */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute requiredRole="admin">
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/sustainability" element={
              <ProtectedRoute>
                <SustainabilityPage />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Redirecionamentos */}
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
