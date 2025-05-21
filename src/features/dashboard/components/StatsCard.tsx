
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, cardClasses, iconClasses, transitions } from "@/lib/utils";

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
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div 
          className={cn(iconClasses.container, "h-9 w-9")}
          aria-hidden="true"
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trend || description) && (
          <div className="flex items-center mt-1.5">
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium mr-2 flex items-center gap-0.5",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
                aria-label={`${trend.isPositive ? 'Aumento' : 'Redução'} de ${Math.abs(trend.value)}%`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
