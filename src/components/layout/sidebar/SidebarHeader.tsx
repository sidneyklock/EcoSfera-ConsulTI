
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader = ({ collapsed }: SidebarHeaderProps) => {
  return (
    <div className="py-4 px-4">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mr-2">
          S
        </div>
        {!collapsed && (
          <div className="font-semibold text-xl">SaaS Platform</div>
        )}
      </div>
    </div>
  );
};
