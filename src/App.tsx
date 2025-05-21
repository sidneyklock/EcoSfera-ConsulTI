
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { AppEventTypes } from "@/utils/events";

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

/**
 * Componente para configurar listeners de eventos customizados
 */
const EventListeners = () => {
  useEffect(() => {
    // Helper para registrar eventos no console em modo de desenvolvimento
    const logEvent = (event: CustomEvent) => {
      if (import.meta.env.DEV) {
        // Já fazemos log no dispatchAppEvent, então isso é apenas para demonstração
        // console.log(`%c[APP EVENT] ${event.type}`, 'color: purple; font-weight: bold', event.detail);
      }
      
      // Aqui poderia ser adicionada a integração com ferramentas como LogRocket ou PostHog
      // if (window.LogRocket) {
      //   window.LogRocket.track(event.type, event.detail);
      // }
    };
    
    // Registrar ouvintes para todos os tipos de eventos
    Object.values(AppEventTypes).forEach(eventType => {
      window.addEventListener(eventType, logEvent as EventListener);
    });
    
    // Cleanup ao desmontar
    return () => {
      Object.values(AppEventTypes).forEach(eventType => {
        window.removeEventListener(eventType, logEvent as EventListener);
      });
    };
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <EventListeners />
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
