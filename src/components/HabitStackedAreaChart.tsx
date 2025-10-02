import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  ReferenceLine,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Habit } from '../lib/schemas';

interface HabitData {
  date: string;
  [habitId: string]: number | string; // habitId -> minutes, plus 'date'
}

interface HabitStackedAreaChartProps {
  data: HabitData[];
  habits: Habit[];
  domain?: [number, number];
  title?: string;
}

const COLOR_PALETTE = [
  '#3b82f6', // blue
  '#f97316', // orange
  '#10b981', // green
  '#ef4444', // red
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#14b8a6', // teal
  '#ec4899', // pink
];

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

  const dateStr = typeof label === 'string' ? label : String(label);
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = tooltipDateFormat.format(new Date(year, month - 1, day));

  const totalMinutes = payload.reduce((sum, entry) => {
    const val = typeof entry.value === 'number' ? entry.value : 0;
    return sum + val;
  }, 0);

  return (
    <div className="trend-tooltip" style={{ backgroundColor: 'white', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{date}</p>
      {payload.reverse().map((entry, index) => (
        <p key={index} style={{ margin: '4px 0', color: entry.color }}>
          {entry.name}: {entry.value} min
        </p>
      ))}
      <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: '4px' }}>
        Total: {totalMinutes} min {totalMinutes >= 60 ? `(${(totalMinutes / 60).toFixed(1)} hrs)` : ''}
      </p>
    </div>
  );
};

export const HabitStackedAreaChart: React.FC<HabitStackedAreaChartProps> = ({
  data,
  habits,
  domain,
  title = 'Time-Based Habits (Daily Minutes)',
}) => {
  const chartData = useMemo(() => {
    if (!domain) return data;

    const [startMs, endMs] = domain;
    const dayMs = 24 * 60 * 60 * 1000;

    // Create a map of existing data by date
    const dataMap = new Map(data.map(d => [d.date, d]));

    // Fill in missing dates with zero values
    const filledData: HabitData[] = [];
    let current = new Date(startMs);
    current.setHours(0, 0, 0, 0);

    while (current.getTime() <= endMs) {
      const dateKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      
      if (dataMap.has(dateKey)) {
        filledData.push(dataMap.get(dateKey)!);
      } else {
        const emptyEntry: HabitData = { date: dateKey };
        habits.forEach(habit => {
          emptyEntry[habit.id] = 0;
        });
        filledData.push(emptyEntry);
      }

      current = new Date(current.getTime() + dayMs);
    }

    return filledData;
  }, [data, domain, habits]);

  const dailyGoalLine = useMemo(() => {
    const goalsWithMinutes = habits
      .filter(h => h.isTimeBased && h.weeklyGoalMinutes)
      .map(h => h.weeklyGoalMinutes!);

    if (goalsWithMinutes.length === 0) return null;

    // Calculate daily target from weekly goals (weekly / 7)
    const totalWeeklyGoal = goalsWithMinutes.reduce((sum, goal) => sum + goal, 0);
    return Math.round(totalWeeklyGoal / 7);
  }, [habits]);

  const xTicks = useMemo<string[] | undefined>(() => {
    if (!domain || chartData.length === 0) return undefined;

    const [startMs, endMs] = domain;
    const dayMs = 24 * 60 * 60 * 1000;
    const spanDays = Math.ceil((endMs - startMs) / dayMs);

    let tickInterval = 1;
    if (spanDays > 180) {
      tickInterval = 30;
    } else if (spanDays > 60) {
      tickInterval = 7;
    } else if (spanDays > 14) {
      tickInterval = 3;
    }

    const ticks: Set<string> = new Set();
    let current = new Date(startMs);
    current.setHours(0, 0, 0, 0);

    let dayCount = 0;
    while (current.getTime() <= endMs) {
      const dateKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      
      if (dayCount % tickInterval === 0) {
        ticks.add(dateKey);
      }

      current = new Date(current.getTime() + dayMs);
      dayCount++;
    }

    // Add all dates where we have data
    chartData.forEach(d => ticks.add(d.date));

    return Array.from(ticks).sort();
  }, [domain, chartData]);

  if (chartData.length === 0 || habits.length === 0) {
    return (
      <div className="trend-chart">
        <h3>{title}</h3>
        <div className="chart-container">
          <p style={{ color: '#6b7280' }}>No time-based habit data to display yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trend-chart">
      <h3>{title}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 20, right: 16, bottom: 10, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const [year, month, day] = value.split('-').map(Number);
                return dateFormatter.format(new Date(year, month - 1, day));
              }}
              ticks={xTicks}
            />
            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={renderTooltip} />
            <Legend />
            {habits.map((habit, index) => (
              <Area
                key={habit.id}
                type="monotone"
                dataKey={habit.id}
                stackId="1"
                name={`${habit.icon || ''} ${habit.name}`.trim()}
                stroke={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                fillOpacity={0.6}
              />
            ))}
            {dailyGoalLine !== null && (
              <ReferenceLine
                y={dailyGoalLine}
                stroke="#9ca3af"
                strokeDasharray="5 5"
                label={{ value: `Daily target: ${dailyGoalLine} min`, position: 'right' }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
