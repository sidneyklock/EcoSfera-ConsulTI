
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Index from "@/features/core/pages/Index";
import NotFound from "@/features/core/pages/NotFound";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ChatPage from "@/features/chat/pages/ChatPage";
import AnalyticsPage from "@/features/analytics/pages/AnalyticsPage";
import UsersPage from "@/features/users/pages/UsersPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import AdminPage from "@/features/admin/pages/AdminPage";
import AuthCallbackPage from "@/features/auth/pages/AuthCallbackPage";
import EmailVerificationPage from "@/features/auth/pages/EmailVerificationPage";
import DashboardLayout from "@/features/layout/components/DashboardLayout";
import SustainabilityPage from "@/features/sustainability/pages/SustainabilityPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Dashboard routes with DashboardLayout as parent */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/sustainability" element={<SustainabilityPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
