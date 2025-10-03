
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
  subtitle
}) => {
  const isMobile = useIsMobile();

  // Format the trend value to always have 1 decimal place
  const formattedTrendValue = trend ? Number(trend.value).toFixed(1) : null;

  return <Card className={cn("relative overflow-hidden transition-all duration-300", "hover:shadow-lg hover:-translate-y-0.5", "border-2", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 p-1.5 border border-primary/20">
            {icon}
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        {isMobile ?
          // Mobile layout - vertical arrangement
          <div className="flex flex-col">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple/80 bg-clip-text text-transparent">
              {value}
            </div>
            {trend && <div className="flex items-center mt-1.5">
                <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium max-w-fit", trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                  {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{formattedTrendValue}%</span>
                </div>
              </div>}
          </div> :
          // Desktop layout - original horizontal arrangement
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple/80 bg-clip-text text-transparent">
              {value}
            </div>
            {trend && <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium", trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{formattedTrendValue}%</span>
              </div>}
          </div>}
        
        {/* Only display subtitle if it's explicitly provided as a string */}
        {subtitle && typeof subtitle === 'string' && (
          <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
        )}
      </CardContent>
    </Card>;
};

export default React.memo(StatCard);
