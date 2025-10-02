import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { Rating } from './schemas';

// Initialize localForage for ratings
const ratingsDB = localforage.createInstance({
  name: 'habit-tracker',
  storeName: 'ratings',
});

/**
 * Save a rating
 */
export async function saveRating(rating: Rating): Promise<void> {
  await ratingsDB.setItem(rating.id, rating);
}

/**
 * Get a rating by ID
 */
export async function getRating(id: string): Promise<Rating | null> {
  return await ratingsDB.getItem<Rating>(id);
}

const DEFAULT_RATINGS: Array<Pick<Rating, 'name' | 'icon' | 'minValue' | 'maxValue'>> = [
  { name: 'Mood', icon: '😊', minValue: 1, maxValue: 10 },
  { name: 'Focus', icon: '🎯', minValue: 1, maxValue: 10 },
  { name: 'Energy', icon: '⚡', minValue: 1, maxValue: 10 },
];

/**
 * Get all ratings
 */
export async function getAllRatings(): Promise<Rating[]> {
  const ratings: Rating[] = [];
  await ratingsDB.iterate<Rating, void>((value: Rating) => {
    ratings.push(value);
  });

  if (ratings.length === 0) {
    const seededRatings: Rating[] = DEFAULT_RATINGS.map((definition) => ({
      id: uuidv4(),
      name: definition.name,
      icon: definition.icon,
      minValue: definition.minValue,
      maxValue: definition.maxValue,
      active: true,
      createdAt: new Date().toISOString(),
    }));

    for (const rating of seededRatings) {
      await saveRating(rating);
    }

    return seededRatings.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Sort by name
  return ratings.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get active ratings only
 */
export async function getActiveRatings(): Promise<Rating[]> {
  const allRatings = await getAllRatings();
  return allRatings.filter(rating => rating.active);
}

/**
 * Delete a rating
 */
export async function deleteRating(id: string): Promise<void> {
  await ratingsDB.removeItem(id);
}

/**
 * Toggle rating active status
 */
export async function toggleRatingActive(id: string): Promise<void> {
  const rating = await getRating(id);
  if (rating) {
    rating.active = !rating.active;
    await saveRating(rating);
  }
}

/**
 * Clear all ratings
 */
export async function clearAllRatings(): Promise<void> {
  await ratingsDB.clear();
}

export default ratingsDB;
