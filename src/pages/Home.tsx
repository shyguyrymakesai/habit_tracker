import React, { useState, useEffect, useMemo } from 'react';
import { EntryForm } from '../components/EntryForm';
import { MetricCard } from '../components/MetricCard';
import { DailyEntry, Rating } from '../lib/schemas';
import { saveEntry, getEntry } from '../lib/db';
import { getToday } from '../lib/dates';
import { getActiveRatings } from '../lib/ratings';
import { useDailyWisdom } from '../features/wisdom/useDailyWisdom';
import { WisdomCard, WeeklyKoansList } from '../features/wisdom/WisdomCard';

export const Home: React.FC = () => {
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [activeRatings, setActiveRatings] = useState<Rating[]>([]);
  const { today: dailyWisdom, weeklyKoans, loading: wisdomLoading, refresh: refreshWisdom } = useDailyWisdom();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const requestedDate = localStorage.getItem('habit-tracker-edit-date');
      if (requestedDate) {
        localStorage.removeItem('habit-tracker-edit-date');
      }

      const targetDate = requestedDate || getToday();
      const [entry, ratings] = await Promise.all([
        getEntry(targetDate),
        getActiveRatings(),
      ]);
      setTodayEntry(entry);
      if (!entry && requestedDate) {
        // If no entry exists for requested date, initialize one with the date preset
        setTodayEntry({
          date: requestedDate,
          habits: [],
          medications: [],
          ratings: [],
          sleepHours: 7,
          note: '',
        });
      }
      setActiveRatings(ratings);
    } catch (error) {
      console.error('Failed to load today\'s entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntrySubmit = async (data: DailyEntry) => {
    try {
      await saveEntry(data);
      setTodayEntry(data);
      if (activeRatings.length === 0) {
        const ratings = await getActiveRatings();
        setActiveRatings(ratings);
      }
      setSaveMessage('✓ Entry saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save entry:', error);
      setSaveMessage('✗ Failed to save entry. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const featuredRatings = useMemo(() => {
    if (!todayEntry) return [];

    const priorityOrder = ['mood', 'energy', 'focus'];
    const prioritized = priorityOrder
      .map((name) =>
        activeRatings.find((rating) => rating.name.toLowerCase() === name)
      )
      .filter((rating): rating is Rating => Boolean(rating));

    const remaining = activeRatings.filter(
      (rating) => !prioritized.includes(rating)
    );

    const orderedRatings = [...prioritized, ...remaining];

    return orderedRatings.slice(0, 3).map((rating) => {
      const log = todayEntry.ratings.find(
        (entryLog) => entryLog.ratingId === rating.id
      );
      const fallbackValue = Math.round((rating.minValue + rating.maxValue) / 2);
      return {
        rating,
        value: log?.value ?? fallbackValue,
      };
    });
  }, [activeRatings, todayEntry]);

  if (isLoading) {
    return (
      <div className="home-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Today's Entry</h1>
        <p className="date-display">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      {saveMessage && (
        <div className={`save-message ${saveMessage.includes('✓') ? 'success' : 'error'}`}>
          {saveMessage}
        </div>
      )}

      {!wisdomLoading && dailyWisdom && <WisdomCard item={dailyWisdom} onRefresh={refreshWisdom} />}
      {!wisdomLoading && weeklyKoans.length > 0 && <WeeklyKoansList items={weeklyKoans} />}

      {todayEntry && featuredRatings.length > 0 && (
        <div className="metrics-grid">
          {featuredRatings.map(({ rating, value }) => {
            const midpoint = (rating.maxValue + rating.minValue) / 2;
            let trend: 'up' | 'down' | 'neutral' = 'neutral';
            if (value > midpoint + 1) trend = 'up';
            if (value < midpoint - 1) trend = 'down';

            return (
              <MetricCard
                key={rating.id}
                title={rating.icon ? `${rating.icon} ${rating.name}` : rating.name}
                value={value}
                unit={`/${rating.maxValue}`}
                trend={trend}
              />
            );
          })}
        </div>
      )}

      <EntryForm 
        initialData={todayEntry || undefined}
        onSubmit={handleEntrySubmit} 
      />
    </div>
  );
};
