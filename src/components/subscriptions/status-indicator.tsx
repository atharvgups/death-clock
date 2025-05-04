
import { Subscription } from "@/types";

interface StatusIndicatorProps {
  status: Subscription['status'];
}

export const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const getStatusColors = () => {
    switch(status) {
      case 'expired':
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-300',
        };
      case 'critical':
        return {
          bg: 'bg-red-500',
          text: 'text-red-300',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          text: 'text-yellow-300',
        };
      default:
        return {
          bg: 'bg-green-500',
          text: 'text-green-300',
        };
    }
  };

  const statusColors = getStatusColors();
  
  return (
    <div className={`px-2 py-1 rounded text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}>
      {status === 'expired' ? 'DECEASED' : 
       status === 'critical' ? 'CRITICAL' :
       status === 'warning' ? 'WARNING' : 'HEALTHY'}
    </div>
  );
};
