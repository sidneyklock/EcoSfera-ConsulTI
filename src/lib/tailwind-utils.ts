
import { cn } from "./utils";

// Icon related classes
export const iconClasses = "h-5 w-5";

// Text related classes
export const textBaseClasses = "text-sm font-medium";
export const textSecondaryClasses = "text-xs text-muted-foreground";

// Layout related classes
export const flexCenterClasses = "flex items-center";
export const flexCenterGapClasses = "flex items-center gap-3";
export const itemPaddingClasses = "px-3 py-2.5 rounded-md";

// Avatar related classes
export const avatarSizeClasses = "h-8 w-8";

// Transition related classes
export const transitionClasses = "transition-all duration-300";

// Sidebar specific classes
export const sidebarItemClasses = cn(
  flexCenterGapClasses,
  itemPaddingClasses,
  "text-sm font-medium transition-colors"
);

export const sidebarItemActiveClasses = "bg-sidebar-accent text-sidebar-accent-foreground";
export const sidebarItemInactiveClasses = "text-sidebar-foreground hover:bg-sidebar-accent/50";

// Sidebar mobile classes
export const sidebarMobileClasses = (collapsed: boolean) => cn(
  "border-r h-screen fixed left-0 top-0 z-40 transition-all duration-300",
  collapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "w-64"
);
