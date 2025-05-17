import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSubscription } from "@/context/subscription-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Subscription } from "@/types";
import { StatusIndicator } from "./status-indicator";
import { LifeBar } from "./life-bar";
import { CardActions } from "./card-actions";
import { FuneralDialog } from "./funeral-dialog";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onEdit }) => {
  const { deleteSubscription, performFuneral, updateSubscription } = useSubscription();
  const [remainingPercent, setRemainingPercent] = useState(100);
  const [funeralDialogOpen, setFuneralDialogOpen] = useState(false);
  const [pulseRate, setPulseRate] = useState("2s");
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(0);
  const prevStatus = useRef(subscription.status);
  
  // Calculate and update progress
  useEffect(() => {
    const updateProgress = () => {
      const now = Date.now();
      const endDate = new Date(subscription.endDate).getTime();
      const startDate = new Date(subscription.startDate).getTime();
      
      // Get remaining time in hours
      const remaining = endDate - now;
      const hoursRemaining = remaining / (1000 * 60 * 60);
      
      // For monthly subscriptions, calculate percentage based on a 30-day period
      let percent;
      if (subscription.frequency === 'monthly') {
        const hoursInMonth = 30 * 24; // 30 days * 24 hours
        percent = Math.max(0, Math.min(100, 100 - (hoursRemaining / hoursInMonth) * 100));
      } else {
        const total = endDate - startDate;
        percent = Math.max(0, Math.min(100, 100 - (remaining / total) * 100));
      }
    
      setRemainingPercent(percent);
      setTimeUntilExpiry(remaining);

      // Update pulse rate based on absolute time remaining
      if (hoursRemaining <= 12) {
        setPulseRate("0.5s"); // Critical: less than 12 hours
      } else if (hoursRemaining <= 24) {
        setPulseRate("1s");   // Warning: less than 24 hours
      } else {
        setPulseRate("2s");   // Normal: more than 24 hours
      }

      // Check if subscription should expire
      if (now >= endDate && subscription.status !== 'expired' && !subscription.forceExpired) {
        if (!subscription.autoRenew) {
          setFuneralDialogOpen(true);
          // Mark as forceExpired to prevent showing dialog again
          updateSubscription(subscription.id, {
            ...subscription,
            forceExpired: true
          });
        } else {
          // Auto-renew logic
          const frequency = subscription.frequency;
          let extension;
          
          // Get current date parts
          const currentEnd = new Date(endDate);
          const newStartDate = new Date(endDate);
          let newEndDate;
          
          switch(frequency) {
            case 'weekly':
              newEndDate = new Date(endDate);
              newEndDate.setDate(newEndDate.getDate() + 7);
              break;
            case 'monthly':
              newEndDate = new Date(endDate);
              newEndDate.setMonth(newEndDate.getMonth() + 1);
              break;
            case 'quarterly':
              newEndDate = new Date(endDate);
              newEndDate.setMonth(newEndDate.getMonth() + 3);
              break;
            case 'yearly':
              newEndDate = new Date(endDate);
              newEndDate.setFullYear(newEndDate.getFullYear() + 1);
              break;
            default:
              newEndDate = new Date(endDate);
              newEndDate.setMonth(newEndDate.getMonth() + 1);
          }
    
          updateSubscription(subscription.id, {
            ...subscription,
            startDate: newStartDate.toISOString(),
            endDate: newEndDate.toISOString()
          });
        }
      }
    };

    // Initial update
    updateProgress();

    // Update every second if not expired
    const interval = setInterval(() => {
      if (subscription.status !== 'expired') {
        updateProgress();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [subscription, updateSubscription]);

  // Handle auto-renew toggle
  const handleAutoRenewToggle = () => {
    updateSubscription(subscription.id, {
      ...subscription,
      autoRenew: !subscription.autoRenew
    });
  };

  // Handle like toggle
  const handleToggleLike = () => {
    updateSubscription(subscription.id, {
      liked: !subscription.liked
    });
  };

  // Add a handler to open the funeral dialog for delete
  const handleDeleteWithFuneral = () => {
    setFuneralDialogOpen(true);
  };

  const timeLeft = formatDistanceToNow(new Date(subscription.endDate), { 
    addSuffix: true,
    includeSeconds: true
  });
  const costDisplay = `$${subscription.cost} / ${subscription.frequency}`;
  
  return (
    <>
      <Card className={`vaporwave-card overflow-hidden border ${subscription.status === 'expired' ? 'opacity-60 flicker' : 'opacity-100'} transition-all`}>
        <LifeBar 
          remainingPercent={remainingPercent}
          pulseRate={pulseRate}
          status={subscription.status}
        />
        
        <CardContent className="pt-6 pb-3">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`text-lg font-bold glow ${subscription.status === 'expired' ? 'line-through opacity-70 flicker' : ''}`}>
                {subscription.name}
              </h3>
              <p className="text-sm text-vaporwave-neonPink glow">{costDisplay}</p>
            </div>
            <StatusIndicator status={subscription.status} />
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">{timeLeft}</span>
          </div>

          {/* Manage button for website link */}
          {subscription.website && subscription.website.length > 5 && (
            <div className="mb-3">
              <a
                href={subscription.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="sm" variant="outline" className="border-vaporwave-neonPink text-vaporwave-neonPink hover:bg-vaporwave-neonPink/20">
                  Manage
                </Button>
              </a>
            </div>
          )}
          
          {subscription.status !== 'expired' && (
            <Progress 
              value={remainingPercent} 
              className="h-2 bg-gray-700" 
              indicatorClassName="transition-all duration-500"
            />
          )}
        </CardContent>
        
        <CardFooter>
          <CardActions 
            status={subscription.status}
            autoRenew={subscription.autoRenew}
            liked={subscription.liked}
            onEdit={() => onEdit(subscription.id)}
            onDelete={handleDeleteWithFuneral}
            onToggleRenewal={handleAutoRenewToggle}
            onToggleLike={handleToggleLike}
          />
        </CardFooter>
      </Card>
      
      {funeralDialogOpen && (
        <FuneralDialog 
          subscription={subscription}
          onClose={() => {
            setFuneralDialogOpen(false);
            deleteSubscription(subscription.id);
          }}
        />
      )}
    </>
  );
};

export default SubscriptionCard;
