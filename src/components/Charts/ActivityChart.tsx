
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export type ChartType = "area" | "bar";

export interface ActivityData {
  date: string;
  value: number;
  activity?: string;
  [key: string]: any;
}

interface ActivityChartProps {
  data: ActivityData[];
  type?: ChartType;
  dataKey?: string;
  xAxisDataKey?: string;
  color?: string;
  secondaryColor?: string;
  title?: string;
  height?: number;
}

const ActivityChart: React.FC<ActivityChartProps> = ({
  data,
  type = "area",
  dataKey = "value",
  xAxisDataKey = "date",
  color = "#3b82f6",
  secondaryColor = "#10b981",
  title,
  height = 300,
}) => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border">
      {title && (
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {type === "area" ? (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fontSize: 12 }} 
              stroke="#94a3b8"
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(255, 255, 255, 0.8)", 
                borderRadius: "0.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
              }} 
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fillOpacity={1}
              fill="url(#colorPrimary)"
            />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={secondaryColor} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fontSize: 12 }} 
              stroke="#94a3b8"
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(255, 255, 255, 0.8)", 
                borderRadius: "0.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
              }} 
            />
            <Legend />
            {Object.keys(data[0] || {})
              .filter(key => key !== xAxisDataKey && typeof data[0][key] === 'number')
              .map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={index === 0 ? "url(#colorPrimary)" : "url(#colorSecondary)"} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
