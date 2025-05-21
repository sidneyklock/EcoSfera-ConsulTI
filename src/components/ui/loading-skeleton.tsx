
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
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
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
    <div className={cn("animate-pulse", className)} {...props}>
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
