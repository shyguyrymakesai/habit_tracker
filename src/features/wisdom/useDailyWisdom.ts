import { useEffect, useState } from 'react';
import { getDailyWisdom, getThisWeeksKoans, isSunday, refreshDailyWisdom } from './wisdom';
import type { WisdomItem } from './types';

export function useDailyWisdom(tz = 'America/Indiana/Indianapolis') {
  const [today, setToday] = useState<WisdomItem | null>(null);
  const [weeklyKoans, setWeeklyKoans] = useState<WisdomItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWisdom = async () => {
    setLoading(true);
    try {
      const item = await getDailyWisdom(new Date(), tz);
      setToday(item);

      // On Sundays, show the weekly koans list
      if (isSunday(tz)) {
        const koans = getThisWeeksKoans(tz);
        setWeeklyKoans(koans);
      } else {
        setWeeklyKoans([]);
      }
    } catch (error) {
      console.error('Failed to load daily wisdom:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const item = await refreshDailyWisdom();
      setToday(item);
    } catch (error) {
      console.error('Failed to refresh wisdom:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWisdom();
  }, [tz]);

  return { today, weeklyKoans, loading, refresh: handleRefresh };
}
