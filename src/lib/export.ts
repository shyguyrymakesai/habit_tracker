import { BackupFile, BackupFileSchema } from './schemas';
import { getAllEntries, clearAllData, saveEntry } from './db';
import { getAllHabits, clearAllHabits, saveHabit } from './habits';
import { getAllMedications, clearAllMedications, saveMedication } from './medications';
import { getAllRatings, clearAllRatings, saveRating } from './ratings';
import { SettingsSchema } from './schemas';

/**
 * Export all data to JSON
 */
export async function exportData(): Promise<string> {
  const [entries, habits, medications, ratings] = await Promise.all([
    getAllEntries(),
    getAllHabits(),
    getAllMedications(),
    getAllRatings(),
  ]);

  const exportData: BackupFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries,
    habits,
    medications,
    ratings,
    settings: {
      theme: 'system',
    },
  };

  // Validate before export
  BackupFileSchema.parse(exportData);

  return JSON.stringify(exportData, null, 2);
}

/**
 * Download data as JSON file
 */
export async function downloadExport(): Promise<void> {
  const data = await exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `habit-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON
 */
export async function importData(jsonString: string): Promise<void> {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate imported data
    const validatedData = BackupFileSchema.parse(data);

    await Promise.all([
      clearAllData(),
      clearAllHabits(),
      clearAllMedications(),
      clearAllRatings(),
    ]);

    await Promise.all([
      ...validatedData.habits.map((habit) => saveHabit(habit)),
      ...validatedData.medications.map((medication) => saveMedication(medication)),
      ...validatedData.ratings.map((rating) => saveRating(rating)),
    ]);

    for (const entry of validatedData.entries) {
      await saveEntry(entry);
    }

    // Settings are currently limited to theme; store for future use if needed
    SettingsSchema.parse(validatedData.settings);
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Failed to import data:', error);
    throw new Error('Invalid import file format');
  }
}

/**
 * Import from file input
 */
export function handleImportFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        await importData(content);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Export data as CSV
 */
export async function exportToCSV(): Promise<string> {
  const [entries, habits, medications, ratings] = await Promise.all([
    getAllEntries(),
    getAllHabits(),
    getAllMedications(),
    getAllRatings(),
  ]);

  if (entries.length === 0) {
    return 'date,sleepHours,note\n';
  }

  const ratingHeaders = ratings.map((rating) => `rating:${rating.name}`);
  const habitHeaders = habits.map((habit) =>
    habit.isTimeBased ? `habit:${habit.name} (minutes)` : `habit:${habit.name} (completed)`
  );
  const medicationHeaders = medications.map((med) => `medication:${med.name}`);

  const header = [
    'date',
    ...ratingHeaders,
    ...habitHeaders,
    ...medicationHeaders,
    'sleepHours',
    'note',
  ].join(',');

  const escapeCSV = (value: string | number | undefined) => {
    if (value === undefined) return '';
    const stringValue = value.toString();
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const rows = entries.map((entry) => {
    const ratingValues = ratings.map((rating) => {
      const log = entry.ratings.find((item) => item.ratingId === rating.id);
      return log ? `${log.value}/${rating.maxValue}` : '';
    });

    const habitValues = habits.map((habit) => {
      const log = entry.habits.find((item) => item.habitId === habit.id);
      if (!log) return '';
      if (habit.isTimeBased) {
        return log.minutes ?? 0;
      }
      return log.completed ? 'yes' : 'no';
    });

    const medicationValues = medications.map((medication) => {
      const log = entry.medications.find((item) => item.medicationId === medication.id);
      if (!log) return '';
      return log.taken ? 'taken' : 'skipped';
    });

    return [
      entry.date,
      ...ratingValues.map(escapeCSV),
      ...habitValues.map(escapeCSV),
      ...medicationValues.map(escapeCSV),
      escapeCSV(entry.sleepHours),
      escapeCSV(entry.note ?? ''),
    ].join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Download data as CSV file
 */
export async function downloadCSV(): Promise<void> {
  const csv = await exportToCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `habit-tracker-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
