
import { cn } from "./utils";

// Icon related classes
export const iconClasses = "h-5 w-5 transition-transform duration-200";
export const iconButtonClasses = "h-10 w-10 p-2.5 transition-all duration-200";
export const iconContainerClasses = "bg-primary/10 text-primary rounded-md flex items-center justify-center";

// Text related classes
export const textBaseClasses = "text-sm font-medium";
export const textSecondaryClasses = "text-xs text-muted-foreground";
export const headingClasses = {
  h1: "text-3xl font-bold tracking-tight",
  h2: "text-2xl font-semibold tracking-tight",
  h3: "text-xl font-semibold",
  h4: "text-lg font-medium"
};

// Layout related classes
export const flexCenterClasses = "flex items-center";
export const flexCenterGapClasses = "flex items-center gap-3";
export const itemPaddingClasses = "px-3 py-2.5 rounded-md";
export const cardPaddingClasses = "p-6";
export const containerClasses = "mx-auto px-4 sm:px-6 lg:px-8";

// Avatar related classes
export const avatarSizeClasses = "h-8 w-8";

// Transition related classes
export const transitionClasses = "transition-all duration-300";
export const hoverStateClasses = "hover:bg-accent/80 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
export const activeStateClasses = "bg-accent text-accent-foreground";

// Transitions object with consistent naming across the application
export const transitions = {
  all: "transition-all duration-300",
  colors: "transition-colors duration-200",
  transform: "transition-transform duration-200",
  opacity: "transition-opacity duration-200",
  hover: {
    scale: "hover:scale-105 transition-transform duration-200",
    elevate: "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
    highlight: "hover:bg-accent/80 hover:text-accent-foreground transition-colors duration-200"
  },
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  active: "active:scale-[0.98] active:transition-transform active:duration-100"
};

// Card state classes - for consistent card styling
export const cardStateClasses = {
  default: "border bg-card shadow-sm",
  interactive: "border bg-card shadow-sm hover:shadow-md transition-all duration-300",
  selected: "border bg-card shadow-md border-primary/50",
  disabled: "border bg-muted/50 shadow-sm opacity-70"
};

// Responsive classes
export const responsiveGridClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
export const responsiveStackClasses = "flex flex-col md:flex-row gap-6";

// Sidebar specific classes
export const sidebarItemClasses = cn(
  flexCenterGapClasses,
  itemPaddingClasses,
  "text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
);

export const sidebarItemActiveClasses = "bg-sidebar-accent text-sidebar-accent-foreground";
export const sidebarItemInactiveClasses = "text-sidebar-foreground hover:bg-sidebar-accent/50";

// Sidebar mobile classes
export const sidebarMobileClasses = (collapsed: boolean) => cn(
  "border-r h-screen fixed left-0 top-0 z-40 transition-all duration-300",
  collapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "w-64"
);

// Sidebar element classes
export const sidebarElementClasses = {
  container: "border-r h-screen fixed left-0 top-0 z-40 transition-all duration-300",
  header: "py-4 px-4",
  footer: "mt-auto",
  content: "px-2"
};

// Accessibility focus classes
export const accessibilityClasses = {
  focusVisible: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  focusWithin: "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
  srOnly: "sr-only"
};

// Button state classes for consistent styling
export const buttonStateClasses = {
  active: "active:scale-95 transition-transform duration-100",
  hover: "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
};

// Animation classes
export const animationClasses = {
  fadeIn: "animate-fade-in",
  slideIn: "animate-slide-in-right",
  pulse: "animate-pulse",
  spin: "animate-spin"
};
