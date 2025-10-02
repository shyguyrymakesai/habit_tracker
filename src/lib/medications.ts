import localforage from 'localforage';
import { Medication, MedicationSchema } from './schemas';

type DoseUnit = NonNullable<Medication['doseUnit']>;

const DOSE_UNIT_LABELS: Record<DoseUnit, string> = {
  mg: 'mg',
  g: 'g',
  ug: 'µg',
};

const DEFAULT_DOSE_UNIT: DoseUnit = 'mg';

/**
 * Format a medication dose into a human-readable string.
 */
export function formatMedicationDose(medication: Medication): string {
  if (typeof medication.doseAmount === 'number') {
    const unit = medication.doseUnit ?? DEFAULT_DOSE_UNIT;
    const unitLabel = DOSE_UNIT_LABELS[unit] ?? unit;
    const amount = Number.isInteger(medication.doseAmount)
      ? medication.doseAmount
      : parseFloat(medication.doseAmount.toFixed(2));
    return `${amount} ${unitLabel}`.trim();
  }

  return medication.dose ?? '';
}

/**
 * Infer dose unit from legacy string value.
 */
export function inferDoseUnitFromString(dose?: string): DoseUnit {
  if (!dose) {
    return DEFAULT_DOSE_UNIT;
  }

  const value = dose.toLowerCase();
  if (value.includes('ug') || value.includes('µg')) {
    return 'ug';
  }
  if (value.includes(' g')) {
    return 'g';
  }
  return 'mg';
}

/**
 * Extract numeric portion from legacy dose string.
 */
export function extractDoseAmountFromString(dose?: string): string {
  if (!dose) {
    return '';
  }

  const numeric = dose.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  return numeric ? numeric[0] : '';
}

// Initialize localForage for medications
const medicationsDB = localforage.createInstance({
  name: 'habit-tracker',
  storeName: 'medications',
});

/**
 * Save a medication
 */
export async function saveMedication(medication: Medication): Promise<void> {
  const normalized = MedicationSchema.parse(medication);
  await medicationsDB.setItem(normalized.id, normalized);
}

/**
 * Get a medication by ID
 */
export async function getMedication(id: string): Promise<Medication | null> {
  return await medicationsDB.getItem<Medication>(id);
}

/**
 * Get all medications
 */
export async function getAllMedications(): Promise<Medication[]> {
  const medications: Medication[] = [];
  await medicationsDB.iterate<Medication, void>((value: Medication) => {
    const parsed = MedicationSchema.safeParse(value);
    if (parsed.success) {
      medications.push(parsed.data);
    } else {
      medications.push(value);
    }
  });
  // Sort by name
  return medications.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get active medications only
 */
export async function getActiveMedications(): Promise<Medication[]> {
  const allMedications = await getAllMedications();
  return allMedications.filter(med => med.active);
}

/**
 * Get medications by timing
 */
export async function getMedicationsByTiming(timing: 'morning' | 'night' | 'both'): Promise<Medication[]> {
  const allMedications = await getActiveMedications();
  return allMedications.filter(
    med => med.timing === timing || med.timing === 'both'
  );
}

/**
 * Delete a medication
 */
export async function deleteMedication(id: string): Promise<void> {
  await medicationsDB.removeItem(id);
}

/**
 * Toggle medication active status
 */
export async function toggleMedicationActive(id: string): Promise<void> {
  const medication = await getMedication(id);
  if (medication) {
    medication.active = !medication.active;
    await saveMedication(medication);
  }
}

/**
 * Clear all medications
 */
export async function clearAllMedications(): Promise<void> {
  await medicationsDB.clear();
}

export default medicationsDB;
