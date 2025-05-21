
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { cva, type VariantProps } from "class-variance-authority"

/**
 * Helper to merge Tailwind CSS classes conditionally
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Core animation tokens - centralized for consistent usage
 */
export const animations = {
  fadeIn: "animate-fade-in",
  fadeOut: "animate-fade-out",
  slideInRight: "animate-slide-in-right",
  slideOutRight: "animate-slide-out-right",
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",
  enter: "animate-enter",
  exit: "animate-exit"
}

/**
 * Common spacing tokens - consistent across components
 */
export const spacing = {
  section: "space-y-8",
  container: "mx-auto px-4 sm:px-6 lg:px-8",
  card: "p-6",
  cardHeader: "mb-4",
  cardFooter: "mt-6",
  gridGap: "gap-6",
  itemGap: "gap-4",
  stackGap: "space-y-4"
}

/**
 * Consistent transition effects
 */
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
}

/**
 * Responsive layout helpers
 */
export const responsive = {
  hidden: {
    mobile: "hidden md:block",
    desktop: "md:hidden"
  },
  grid: {
    base: "grid gap-6",
    cols2: "grid grid-cols-1 md:grid-cols-2 gap-6",
    cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    cols4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  },
  stack: {
    horizontal: "flex flex-row items-center gap-4",
    vertical: "flex flex-col gap-4"
  }
}

/**
 * Icon related classes
 */
export const iconClasses = {
  base: "h-5 w-5 transition-transform duration-200",
  button: "h-10 w-10 p-2.5 transition-all duration-200",
  container: "bg-primary/10 text-primary rounded-md flex items-center justify-center"
}

/**
 * Text related classes
 */
export const textClasses = {
  base: "text-sm font-medium",
  secondary: "text-xs text-muted-foreground",
  heading: {
    h1: "text-3xl font-bold tracking-tight",
    h2: "text-2xl font-semibold tracking-tight",
    h3: "text-xl font-semibold",
    h4: "text-lg font-medium"
  }
}

/**
 * Layout helper classes
 */
export const layoutClasses = {
  flexCenter: "flex items-center justify-center",
  flexCenterGap: "flex items-center gap-3",
  itemPadding: "px-3 py-2.5 rounded-md",
  cardPadding: "p-6"
}

/**
 * Button state classes for consistent styling
 */
export const buttonStateClasses = {
  active: "active:scale-95 transition-transform duration-100",
  hover: "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
}

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
 * Avatar size classes
 */
export const avatarSizeClasses = "h-8 w-8";

/**
 * Card state classes - for consistent card styling
 */
export const cardClasses = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-border/60",
        interactive: "border-border/60 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5",
        selected: "border-primary/50 shadow-md",
        disabled: "bg-muted/50 opacity-70"
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export type CardVariantsProps = VariantProps<typeof cardClasses>

/**
 * Button variants with consistent styling
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>

/**
 * Skeleton loader variants
 */
export const skeletonClasses = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        text: "h-4 w-full",
        card: "w-full h-full",
        avatar: "h-12 w-12 rounded-full",
        button: "h-10 w-20 rounded-md",
        stats: "h-full w-full"
      }
    },
    defaultVariants: {
      variant: "text"
    }
  }
)

export type SkeletonVariantsProps = VariantProps<typeof skeletonClasses>

/**
 * Accessibility classes
 */
export const a11yClasses = {
  focusVisible: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  focusWithin: "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
  srOnly: "sr-only"
}
