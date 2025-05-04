
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Hourglass, Skull, CircleDollarSign } from "lucide-react";
import { useSubscription } from "@/context/subscription-context";
import { formatDistanceToNow } from "date-fns";

const StatsOverview = () => {
  const { stats, subscriptions } = useSubscription();
  
  const criticalCount = subscriptions.filter(sub => sub.status === 'critical').length;
  
  const nextToExpireInfo = stats.nextToExpire 
    ? `${stats.nextToExpire.name} (${formatDistanceToNow(new Date(stats.nextToExpire.endDate))})`
    : "None";
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          <Hourglass className="h-4 w-4 text-vaporwave-neonPink" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalActive}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalExpired} expired
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Monthly Burn</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-vaporwave-neonPink" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.monthlyCost}</div>
          <p className="text-xs text-muted-foreground mt-1">
            ${stats.yearlyCost} yearly
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Critical</CardTitle>
          <Skull className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{criticalCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Expiring within 3 days
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Next to Expire</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold truncate">
            {nextToExpireInfo}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
