
import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  color = "bg-health-blue",
  trend,
}) => {
  return (
    <div className="rounded-lg shadow-sm overflow-hidden card-gradient border">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          {icon && <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>{icon}</div>}
        </div>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <span className={`ml-2 flex items-baseline text-sm font-semibold ${trend.isPositive ? 'text-health-green' : 'text-health-red'}`}>
              {trend.isPositive ? '↑' : '↓'}
              {trend.value}%
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
    </div>
  );
};

export default StatCard;
