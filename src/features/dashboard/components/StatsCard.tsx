
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, cardClasses, iconClasses, transitions, layoutClasses, textClasses, a11yClasses, animations } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
}

export const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  isLoading = false,
}: StatsCardProps) => {
  return (
    <Card 
      className={cn(
        cardClasses({ variant: "interactive" }),
        transitions.all,
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className={textClasses.base}>{title}</CardTitle>
        <div 
          className={cn(iconClasses.container, "h-9 w-9")}
          aria-hidden="true"
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn(textClasses.heading.h2, "mb-1")}>
          {isLoading ? (
            <span className={cn("bg-muted h-7 w-20 block rounded-md", animations.pulse)} />
          ) : (
            value
          )}
        </div>
        {(trend || description) && (
          <div className={cn(layoutClasses.flexCenterGap, "mt-1.5")}>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium flex items-center gap-0.5",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
                aria-label={`${trend.isPositive ? 'Aumento' : 'Redução'} de ${Math.abs(trend.value)}%`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <p className={textClasses.secondary}>
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
