
import React from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'card' | 'table' | 'text' | 'avatar' | 'button';
  count?: number;
};

export function LoadingSkeleton({
  className,
  variant = 'text',
  count = 1,
  ...props
}: SkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
            <Skeleton className="h-8 w-1/3 mt-3" />
            <div className="flex items-center mt-1">
              <Skeleton className="h-3 w-16 mr-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        );
      case 'table':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        );
      case 'avatar':
        return <Skeleton className="h-12 w-12 rounded-full" />;
      case 'button':
        return <Skeleton className="h-10 w-20 rounded-md" />;
      case 'text':
      default:
        return <Skeleton className="h-4 w-full" />;
    }
  };

  return (
    <div className={cn("animate-pulse", className)} {...props} aria-busy="true" aria-live="polite">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="mb-2">
            {renderSkeleton()}
          </div>
        ))}
    </div>
  );
}
