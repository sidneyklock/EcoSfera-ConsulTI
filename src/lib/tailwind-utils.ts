
import { cn } from "@/lib/utils";

/**
 * Icon related classes
 */
export const iconClasses = "h-5 w-5 transition-transform duration-200";

/**
 * Sidebar element classes
 */
export const sidebarElementClasses = {
  container: "w-64 h-screen flex flex-col overflow-y-auto",
  header: "flex items-center justify-between",
  content: "flex-1 overflow-y-auto",
  footer: "flex flex-col"
};

/**
 * Sidebar item classes
 */
export const sidebarItemClasses = "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors";
export const sidebarItemActiveClasses = "bg-primary/10 text-primary hover:bg-primary/15";
export const sidebarItemInactiveClasses = "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

/**
 * Button state classes for consistent styling
 */
export const buttonStateClasses = {
  active: "active:scale-95 transition-transform duration-100",
  hover: "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
};

/**
 * Layout helper classes
 */
export const flexCenterClasses = "flex items-center justify-center";
export const flexCenterGapClasses = "flex items-center gap-3";
export const textBaseClasses = "text-sm font-medium";
export const textSecondaryClasses = "text-xs text-muted-foreground";
export const avatarSizeClasses = "h-8 w-8";
