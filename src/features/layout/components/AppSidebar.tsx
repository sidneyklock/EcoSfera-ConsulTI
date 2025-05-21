
import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarFooter } from './sidebar/SidebarFooter';

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
