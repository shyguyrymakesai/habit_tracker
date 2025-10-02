import { z } from 'zod';

/**
 * Rating schema (custom metrics to track on a scale)
 */
export const RatingSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  icon: z.string().max(10).optional(), // emoji or icon
  minValue: z.number().default(0),
  maxValue: z.number().default(10),
  active: z.boolean().default(true),
  createdAt: z.string().datetime(),
});

export type Rating = z.infer<typeof RatingSchema>;

/**
 * Rating log entry (for tracking rating values)
 */
export const RatingLogSchema = z.object({
  ratingId: z.string().uuid(),
  value: z.number(),
});

export type RatingLog = z.infer<typeof RatingLogSchema>;

/**
 * Habit schema
 */
export const HabitSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  icon: z.string().max(10).optional(), // emoji or icon
  isTimeBased: z.boolean().default(false), // true for time-based activities (minutes)
  weeklyGoalMinutes: z.number().min(0).optional(), // weekly goal in minutes for time-based habits
  active: z.boolean().default(true),
  createdAt: z.string().datetime(),
});

export type Habit = z.infer<typeof HabitSchema>;

/**
 * Habit log entry (for tracking which habits were completed)
 */
export const HabitLogSchema = z.object({
  habitId: z.string().uuid(),
  completed: z.boolean(),
  minutes: z.number().min(0).optional(), // for time-based habits
});

export type HabitLog = z.infer<typeof HabitLogSchema>;

/**
 * Medication schema
 */
export const MedicationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  doseAmount: z.number().min(0.001, 'Dose must be greater than 0').optional(),
  doseUnit: z.enum(['mg', 'g', 'ug']).default('mg'),
  dose: z.string().min(1).max(50).optional(),
  timing: z.enum(['morning', 'night', 'both']),
  active: z.boolean().default(true),
  createdAt: z.string().datetime(),
}).refine((data) => {
  if (data.doseAmount !== undefined) {
    return true;
  }
  return !!(data.dose && data.dose.trim().length > 0);
}, {
  message: 'Dose is required',
  path: ['doseAmount'],
});

export type Medication = z.infer<typeof MedicationSchema>;

/**
 * Medication log entry (for tracking which meds were taken)
 */
export const MedicationLogSchema = z.object({
  medicationId: z.string().uuid(),
  taken: z.boolean(),
});

export type MedicationLog = z.infer<typeof MedicationLogSchema>;

/**
 * Daily Entry schema
 */
export const DailyEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  habits: z.array(HabitLogSchema).default([]),
  medications: z.array(MedicationLogSchema).default([]),
  ratings: z.array(RatingLogSchema).default([]),
  sleepHours: z.number().min(0).max(14),
  note: z.string().max(1000).optional()
});

export type DailyEntry = z.infer<typeof DailyEntrySchema>;

/**
 * Settings schema
 */
export const SettingsSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).default('system'),
});

export type AppSettings = z.infer<typeof SettingsSchema>;

/**
 * Backup file schema
 */
export const BackupFileSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  entries: z.array(DailyEntrySchema),
  habits: z.array(HabitSchema),
  medications: z.array(MedicationSchema),
  ratings: z.array(RatingSchema),
  settings: SettingsSchema
});

export type BackupFile = z.infer<typeof BackupFileSchema>;
