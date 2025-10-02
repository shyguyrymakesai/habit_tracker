import React from 'react';

interface TrendChartProps {
  data: Array<{ date: string; value: number }>;
  title?: string;
  color?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ 
  data, 
  title = 'Trend',
  color = '#3b82f6'
}) => {
  return (
    <div className="trend-chart">
      <h3>{title}</h3>
      <div className="chart-container">
        {/* Chart implementation will go here (e.g., recharts, chart.js) */}
        <p style={{ color }}>Chart placeholder - {data.length} data points</p>
      </div>
    </div>
  );
};
