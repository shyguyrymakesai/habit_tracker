import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { Habit } from './schemas';

// Initialize localForage for habits
const habitsDB = localforage.createInstance({
  name: 'habit-tracker',
  storeName: 'habits',
});

/**
 * Save a habit
 */
export async function saveHabit(habit: Habit): Promise<void> {
  await habitsDB.setItem(habit.id, habit);
}

/**
 * Get a habit by ID
 */
export async function getHabit(id: string): Promise<Habit | null> {
  return await habitsDB.getItem<Habit>(id);
}

const DEFAULT_HABITS: Array<Pick<Habit, 'name' | 'icon' | 'isTimeBased'>> = [
  { name: 'Gym', icon: '🏋️', isTimeBased: false },
  { name: 'Meditation', icon: '🧘', isTimeBased: true },
  { name: 'Reading', icon: '📚', isTimeBased: true },
];

/**
 * Get all habits
 */
export async function getAllHabits(): Promise<Habit[]> {
  const habits: Habit[] = [];
  await habitsDB.iterate<Habit, void>((value: Habit) => {
    habits.push(value);
  });

  if (habits.length === 0) {
    const seededHabits: Habit[] = DEFAULT_HABITS.map((definition) => ({
      id: uuidv4(),
      name: definition.name,
      icon: definition.icon,
      isTimeBased: definition.isTimeBased,
      active: true,
      createdAt: new Date().toISOString(),
    }));

    for (const habit of seededHabits) {
      await saveHabit(habit);
    }

    return seededHabits.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Sort by name
  return habits.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get active habits only
 */
export async function getActiveHabits(): Promise<Habit[]> {
  const allHabits = await getAllHabits();
  return allHabits.filter(habit => habit.active);
}

/**
 * Delete a habit
 */
export async function deleteHabit(id: string): Promise<void> {
  await habitsDB.removeItem(id);
}

/**
 * Toggle habit active status
 */
export async function toggleHabitActive(id: string): Promise<void> {
  const habit = await getHabit(id);
  if (habit) {
    habit.active = !habit.active;
    await saveHabit(habit);
  }
}

/**
 * Clear all habits
 */
export async function clearAllHabits(): Promise<void> {
  await habitsDB.clear();
}

export default habitsDB;
