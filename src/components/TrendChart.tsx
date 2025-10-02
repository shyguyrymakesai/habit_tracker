import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Scatter,
  Line,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface TrendChartProps {
  data: Array<{ date: string; value: number }>;
  title?: string;
  color?: string;
  domain?: [number, number];
}

interface ScatterPoint {
  x: number;
  y: number;
  dateLabel: string;
}

interface TrendPoint {
  x: number;
  trend: number;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

const tooltipDateFormat = new Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit',
});

const renderTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || payload.length === 0 || label == null) {
    return null;
  }

  const entry = payload[0];
  const rawValue = typeof entry.value === 'number' ? entry.value : Number(entry.value);
  if (Number.isNaN(rawValue)) {
    return null;
  }

  const rawLabel = typeof label === 'number' ? label : Number(label);
  if (Number.isNaN(rawLabel)) {
    return null;
  }

  const date = tooltipDateFormat.format(new Date(rawLabel));
  const value = rawValue.toFixed(0);

  return (
    <div className="trend-tooltip">
      [date: {date}, value: {value}/10]
    </div>
  );
};

const computeTrendLine = (points: ScatterPoint[]): TrendPoint[] => {
  if (points.length < 2) {
    return [];
  }

  const n = points.length;
  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let numerator = 0;
  let denominator = 0;

  points.forEach((point) => {
    const diffX = point.x - meanX;
    numerator += diffX * (point.y - meanY);
    denominator += diffX * diffX;
  });

  if (denominator === 0) {
    return [];
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));

  return [
    { x: minX, trend: intercept + slope * minX },
    { x: maxX, trend: intercept + slope * maxX },
  ];
};

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  title = 'Trend',
  color = '#3b82f6',
  domain,
}) => {
  const scatterPoints = useMemo<ScatterPoint[]>(
    () => {
      const points = data.map((point) => {
        const [year, month, day] = point.date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const epoch = dateObj.getTime();
        return {
          x: epoch,
          y: point.value,
          dateLabel: dateFormatter.format(dateObj),
        };
      });

      return points.sort((a, b) => a.x - b.x);
    },
    [data]
  );

  const trendLine = useMemo<TrendPoint[]>(() => computeTrendLine(scatterPoints), [scatterPoints]);

  const computedDomain = useMemo<[number, number] | undefined>(() => {
    if (domain) {
      return domain;
    }

    if (scatterPoints.length === 0) {
      return undefined;
    }

    const values = scatterPoints.map((p) => p.x);
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (min === max) {
      const padding = 24 * 60 * 60 * 1000;
      return [min - padding, max + padding];
    }
    const padding = Math.round((max - min) * 0.02);
    return [min - padding, max + padding];
  }, [domain, scatterPoints]);

  const xTicks = useMemo<number[] | undefined>(() => {
    const activeDomain = domain ?? computedDomain;
    if (!activeDomain) return undefined;

    const [start, end] = activeDomain;
    const ticks: Set<number> = new Set();
    const dayMs = 24 * 60 * 60 * 1000;
    const spanDays = Math.ceil((end - start) / dayMs);
    
    // Determine tick interval based on range
    let tickInterval = 1;
    if (spanDays > 180) {
      tickInterval = 30; // Monthly for year view
    } else if (spanDays > 60) {
      tickInterval = 7; // Weekly for longer month views
    } else if (spanDays > 14) {
      tickInterval = 3; // Every 3 days for month view
    } else {
      tickInterval = 1; // Daily for week view
    }
    
    // Generate ticks at regular intervals from domain start
    let current = new Date(start);
    current.setHours(0, 0, 0, 0);
    
    let dayCount = 0;
    while (current.getTime() <= end) {
      if (dayCount % tickInterval === 0 || current.getTime() === start) {
        ticks.add(current.getTime());
      }
      current = new Date(current.getTime() + dayMs);
      dayCount++;
    }
    
    // Always include the end date
    const endOfDay = new Date(end);
    endOfDay.setHours(0, 0, 0, 0);
    if (endOfDay.getTime() >= start) {
      ticks.add(endOfDay.getTime());
    }
    
    // ALSO include all dates where we have actual data points
    scatterPoints.forEach(point => {
      const pointDate = new Date(point.x);
      pointDate.setHours(0, 0, 0, 0);
      ticks.add(pointDate.getTime());
    });
    
    // Convert to sorted array
    return Array.from(ticks).sort((a, b) => a - b);
  }, [domain, computedDomain, scatterPoints]);

  const yDomain = useMemo<[number, number]>(() => {
    if (scatterPoints.length === 0) {
      return [0, 10];
    }

    const values = scatterPoints.map((point) => point.y);
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) {
      const padding = Math.max(1, Math.abs(min) * 0.1);
      return [min - padding, max + padding];
    }

    const lower = Math.min(min, 0);
    const upper = Math.max(max, 10);
    return [Math.floor(lower), Math.ceil(upper)];
  }, [scatterPoints]);

  return (
    <div className="trend-chart">
      <h3>{title}</h3>
      <div className="chart-container">
        {scatterPoints.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Not enough data to display this trend yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 16, bottom: 10, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                domain={domain ?? computedDomain ?? ['dataMin', 'dataMax']}
                scale="time"
                tickFormatter={(value) => dateFormatter.format(new Date(value))}
                name="Date"
                ticks={xTicks}
              />
              <YAxis type="number" dataKey="y" domain={yDomain} name="Value" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={renderTooltip} />
              <Legend />
              <Scatter
                name="Daily value"
                data={scatterPoints}
                fill={color}
                line={{ stroke: color, strokeWidth: 2, strokeOpacity: 0.7 }}
                lineType="joint"
              />
              {trendLine.length === 2 && (
                <Line
                  name="Trend line"
                  type="linear"
                  dataKey="trend"
                  data={trendLine}
                  dot={false}
                  stroke="#9ca3af"
                  strokeWidth={2}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
