import { Button } from "@/components/ui/button";
import { Heart, HeartOff, Trash2 } from "lucide-react";

interface CardActionsProps {
  status: 'expired' | 'critical' | 'warning' | 'active';
  autoRenew: boolean;
  liked: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleRenewal: () => void;
  onToggleLike: () => void;
}

export const CardActions = ({ 
  status, 
  autoRenew, 
  liked,
  onEdit, 
  onDelete, 
  onToggleRenewal, 
  onToggleLike 
}: CardActionsProps) => {
  return (
    <div className="pt-0 flex justify-between">
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="border-gray-700 hover:bg-gray-800"
          onClick={onEdit}
        >
          Details
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-red-400"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className={liked ? 'text-pink-400' : 'text-gray-400'}
          onClick={onToggleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          {liked ? <Heart className="h-4 w-4 fill-pink-400" /> : <Heart className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
