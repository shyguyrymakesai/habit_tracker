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

export const Trends: React.FC = () => {
  const [timeRange, setTimeRange] = useState<RangeOption>('month');
  const [chartData, setChartData] = useState<Array<{ date: string; value: number }>>([]);
  const [activeRating, setActiveRating] = useState<Rating | null>(null);
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

      if (ratings.length === 0) {
        setActiveRating(null);
        setChartData([]);
        return;
      }

      const primaryRating = ratings.find(
        (rating) => ['mood', 'energy', 'focus'].includes(rating.name.toLowerCase())
      ) || ratings[0];

      setActiveRating(primaryRating);

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

      const dataPoints = filtered
        .map((entry) => {
          const log = entry.ratings.find((rating) => rating.ratingId === primaryRating.id);
          if (!log) return null;
          return {
            date: entry.date,
            value: log.value,
          };
        })
        .filter((point): point is { date: string; value: number } => point !== null);

      setChartData(dataPoints);
    } catch (error) {
      console.error('Failed to load trend data:', error);
      setActiveRating(null);
      setChartData([]);
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
      ) : activeRating ? (
        <div className="charts-container">
          <TrendChart
            data={chartData}
            title={`${activeRating.icon ? `${activeRating.icon} ` : ''}${activeRating.name} (${RANGE_LABELS[timeRange]})`}
          />
          {/* Additional charts can be added here */}
        </div>
      ) : (
        <p>No ratings available to display trends yet.</p>
      )}
    </div>
  );
};
