import React, { useState, useEffect } from 'react';
import { TrendChart } from '../components/TrendChart';
import { getAllEntries } from '../lib/db';
import { getAllRatings } from '../lib/ratings';
import { Rating } from '../lib/schemas';

type RangeOption = 'week' | 'month' | 'year';

const RANGE_LABELS: Record<RangeOption, string> = {
  week: 'Past 7 Days',
  month: 'Past 30 Days',
  year: 'Past 365 Days',
};

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

export const Trends: React.FC = () => {
  const [timeRange, setTimeRange] = useState<RangeOption>('month');
  const [ratingSeries, setRatingSeries] = useState<Array<{ rating: Rating; data: Array<{ date: string; value: number }> }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrendData(timeRange);
  }, [timeRange]);

  const loadTrendData = async (range: RangeOption) => {
    setIsLoading(true);
    try {
      const [entries, ratings] = await Promise.all([
        getAllEntries(),
        getAllRatings(),
      ]);

      const activeRatings = ratings.filter((rating) => rating.active !== false);

      if (activeRatings.length === 0) {
        setRatingSeries([]);
        return;
      }

      const now = new Date();
      const startDate = new Date(now);
      if (range === 'week') {
        startDate.setDate(now.getDate() - 6);
      } else if (range === 'month') {
        startDate.setDate(now.getDate() - 29);
      } else {
        startDate.setFullYear(now.getFullYear() - 1);
      }

      const startString = startDate.toISOString().split('T')[0];

      const filtered = entries
        .filter((entry) => entry.date >= startString)
        .sort((a, b) => a.date.localeCompare(b.date));

      const trendSeries = activeRatings.map((rating) => {
        const dataPoints = filtered
          .map((entry) => {
            const log = entry.ratings.find((ratingLog) => ratingLog.ratingId === rating.id);
            if (!log) return null;
            return {
              date: entry.date,
              value: log.value,
            };
          })
          .filter((point): point is { date: string; value: number } => point !== null);

        return {
          rating,
          data: dataPoints,
        };
      });

      setRatingSeries(trendSeries);
    } catch (error) {
      console.error('Failed to load trend data:', error);
      setRatingSeries([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="trends-page">
      <h1>Trends & Analytics</h1>

      <div className="time-range-selector">
        {(['week', 'month', 'year'] as RangeOption[]).map((range) => (
          <button
            key={range}
            className={timeRange === range ? 'active' : ''}
            onClick={() => setTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p>Loading trend data...</p>
      ) : ratingSeries.length > 0 ? (
        <div className="charts-container">
          {ratingSeries.map(({ rating, data }, index) => (
            <TrendChart
              key={rating.id}
              data={data}
              color={COLOR_PALETTE[index % COLOR_PALETTE.length]}
              title={`${rating.icon ? `${rating.icon} ` : ''}${rating.name} (${RANGE_LABELS[timeRange]})`}
            />
          ))}
        </div>
      ) : (
        <p>No ratings available to display trends yet.</p>
      )}
    </div>
  );
};
