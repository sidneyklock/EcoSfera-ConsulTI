
import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Toaster } from 'sonner';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/10">
        <AppSidebar />
        <div className="flex-1">
          <main className="p-4 md:p-6 lg:p-8 w-full">
            {children}
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
