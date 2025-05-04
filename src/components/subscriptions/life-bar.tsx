
interface LifeBarProps {
  remainingPercent: number;
  pulseRate: string;
  status: 'expired' | 'critical' | 'warning' | 'active';
}

export const LifeBar = ({ remainingPercent, pulseRate, status }: LifeBarProps) => {
  const getStatusColor = () => {
    switch(status) {
      case 'expired': return 'bg-gray-500';
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="relative">
      <div 
        className={`absolute bottom-0 left-0 h-1 ${getStatusColor()} clip-life-bar`} 
        style={{ 
          width: `${remainingPercent}%`, 
          transition: 'width 1s linear',
          animation: status !== 'expired' ? `pulse ${pulseRate} ease-in-out infinite` : 'none'
        }}
      />
    </div>
  );
};
