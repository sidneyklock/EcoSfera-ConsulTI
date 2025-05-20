
import React from 'react';

export interface SidebarProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsible?: "icon" | "offcanvas" | "none";
  collapsed?: boolean;
  onCollapsedChange?: (state: boolean) => void;
  className?: string;
}

export function Sidebar({ children, className, ...props }: SidebarProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
