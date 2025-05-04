import React, { useState } from "react";
import { useSubscription } from "@/context/subscription-context";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Rocket } from "lucide-react";

interface CemeterySubscriptionFormProps {
  subscriptionId: string;
  onSuccess: () => void;
}

export const CemeterySubscriptionForm = ({ subscriptionId, onSuccess }: CemeterySubscriptionFormProps) => {
  const { getSubscription, updateSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  
  const subscription = getSubscription(subscriptionId);
  if (!subscription) return null;

  const handleResurrect = async () => {
    setIsLoading(true);
    // Add 30 days from now
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + 30);
    
    // Artificial delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateSubscription(subscriptionId, {
      status: 'active',
      endDate: newEndDate.toISOString(),
      deleted: false,
      forceExpired: false
    });
    
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-black/50 border-vaporwave-neonPink">
        <AlertDescription className="text-center py-2">
          This subscription has passed into the digital afterlife.
          Do you wish to attempt resurrection?
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button
          onClick={handleResurrect}
          className="bg-vaporwave-neonPink hover:bg-vaporwave-neonPink/80 text-white font-semibold px-8 py-6 text-lg animate-pulse"
          disabled={isLoading}
        >
          <Rocket className="mr-2 h-5 w-5" />
          Resurrect Subscription
        </Button>
      </div>
    </div>
  );
};
