import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend = "neutral", 
  trendValue 
}: StatsCardProps) => {
  const trendColor = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-court transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-basketball-orange" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(description || trendValue) && (
          <div className="flex items-center space-x-2 mt-1">
            {trendValue && (
              <span className={`text-xs ${trendColor[trend]}`}>
                {trend === "up" && "↗"} {trend === "down" && "↘"} {trendValue}
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