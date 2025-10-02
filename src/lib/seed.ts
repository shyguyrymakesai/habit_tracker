import { DailyEntry } from './schemas';
import { saveEntry } from './db';
import { subtractDays, getToday } from './dates';
import { getAllHabits } from './habits';
import { getAllMedications } from './medications';
import { getAllRatings } from './ratings';

/**
 * Generate demo data for the last N days
 */
export async function generateDemoData(days: number = 30): Promise<DailyEntry[]> {
  const entries: DailyEntry[] = [];
  const today = getToday();

  const [habits, medications, ratings] = await Promise.all([
    getAllHabits(),
    getAllMedications(),
    getAllRatings(),
  ]);

  for (let i = 0; i < days; i++) {
    const date = subtractDays(today, i);

    // Randomly skip some days to simulate real usage
    if (Math.random() > 0.85) continue;

    const habitLogs = habits.map((habit) => {
      if (habit.isTimeBased) {
        const minutes = Math.random() > 0.4 ? Math.floor(Math.random() * 60) + 10 : 0;
        return {
          habitId: habit.id,
          completed: minutes > 0,
          minutes,
        };
      }

      const completed = Math.random() > 0.3;
      return {
        habitId: habit.id,
        completed,
      };
    });

    const medicationLogs = medications.map((medication) => ({
      medicationId: medication.id,
      taken: Math.random() > 0.3,
    }));

    const ratingLogs = ratings.map((rating) => {
      const range = rating.maxValue - rating.minValue;
      const value = Math.round(
        rating.minValue + Math.random() * (range === 0 ? 1 : range)
      );
      return {
        ratingId: rating.id,
        value,
      };
    });

    const entry: DailyEntry = {
      date,
      habits: habitLogs,
      medications: medicationLogs,
      ratings: ratingLogs,
      sleepHours: Number((6 + Math.random() * 3).toFixed(1)),
      note: Math.random() > 0.7 ? 'Felt really productive today!' : undefined,
    };

    entries.push(entry);
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Seed the database with demo data
 */
export async function seedDatabase(days: number = 30): Promise<void> {
  const entries = await generateDemoData(days);

  for (const entry of entries) {
    await saveEntry(entry);
  }

  console.log(`✅ Seeded database with ${entries.length} demo entries`);
}

/**
 * Clear and reseed the database
 */
export async function resetWithDemoData(days: number = 30): Promise<void> {
  const { clearAllData } = await import('./db');
  await clearAllData();
  await seedDatabase(days);
}

/**
 * Check if database is empty
 */
export async function isDatabaseEmpty(): Promise<boolean> {
  const { getAllEntries } = await import('./db');
  const entries = await getAllEntries();
  return entries.length === 0;
}

/**
 * Prompt user to load demo data if database is empty
 */
export async function promptDemoDataIfEmpty(): Promise<void> {
  const isEmpty = await isDatabaseEmpty();
  
  if (isEmpty) {
    const shouldLoad = confirm(
      'No data found. Would you like to load demo data to explore the app?'
    );
    
    if (shouldLoad) {
      await seedDatabase(30);
      window.location.reload();
    }
  }
}
