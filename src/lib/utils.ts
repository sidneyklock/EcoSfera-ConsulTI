
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Common animation classes
export const animations = {
  fadeIn: "animate-fade-in",
  fadeOut: "animate-fade-out",
  slideInRight: "animate-slide-in-right",
  slideOutRight: "animate-slide-out-right",
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce"
}

// Common spacing classes
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

// Common transition classes
export const transitions = {
  all: "transition-all duration-300",
  colors: "transition-colors duration-200",
  transform: "transition-transform duration-200",
  opacity: "transition-opacity duration-200",
  hover: {
    scale: "hover:scale-105 transition-transform duration-200",
    elevate: "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
    highlight: "hover:bg-accent/80 hover:text-accent-foreground transition-colors duration-200"
  }
}

// Responsive helpers
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
