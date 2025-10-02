import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  trend = 'neutral' 
}) => {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <div className="metric-value">
        {value} {unit && <span className="unit">{unit}</span>}
      </div>
      {trend !== 'neutral' && (
        <div className={`trend trend-${trend}`}>
          {trend === 'up' ? '↑' : '↓'}
        </div>
      )}
    </div>
  );
};
