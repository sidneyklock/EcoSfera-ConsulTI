
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { layoutClasses } from "@/lib/utils";
import { SolutionSelector } from "../SolutionSelector";

interface SidebarHeaderProps {
  collapsed: boolean;
  solutionId?: string | null;
}

export const SidebarHeader = ({ collapsed, solutionId }: SidebarHeaderProps) => {
  return (
    <div className="py-4 px-4">
      <div className={layoutClasses.flexCenter}>
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mr-2">
          S
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <div className="font-semibold text-xl">SaaS Platform</div>
            {solutionId && <SolutionSelector />}
          </div>
        )}
      </div>
    </div>
  );
};
