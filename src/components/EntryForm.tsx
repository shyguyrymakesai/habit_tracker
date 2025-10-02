import React, { useState } from 'react';
import { DailyEntry, DailyEntrySchema } from '../lib/schemas';
import { MedicationList } from './MedicationList';
import { HabitList } from './HabitList';
import { RatingList } from './RatingList';

interface EntryFormProps {
  initialData?: Partial<DailyEntry>;
  onSubmit: (data: DailyEntry) => void;
  onCancel?: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ 
  initialData, 
  onSubmit,
  onCancel 
}) => {
  const [formData, setFormData] = useState<DailyEntry>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    habits: initialData?.habits ?? [],
    medications: initialData?.medications ?? [],
    ratings: initialData?.ratings ?? [],
    sleepHours: initialData?.sleepHours ?? 7,
    note: initialData?.note || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate with Zod
    const result = DailyEntrySchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onSubmit(result.data);
  };

  const updateField = <K extends keyof DailyEntry>(
    field: K,
    value: DailyEntry[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      <h2>Daily Entry</h2>
      
      {/* Date */}
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => updateField('date', e.target.value)}
          className={errors.date ? 'error' : ''}
        />
        {errors.date && <span className="error-message">{errors.date}</span>}
      </div>

      {/* Custom Habits */}
      <div className="form-section">
        <HabitList
          value={formData.habits}
          onChange={(logs) => updateField('habits', logs)}
        />
      </div>

      {/* Medications */}
      <div className="form-section">
        <MedicationList
          value={formData.medications}
          onChange={(logs) => updateField('medications', logs)}
        />
      </div>

      {/* Ratings */}
      <div className="form-section">
        <RatingList
          value={formData.ratings}
          onChange={(logs) => updateField('ratings', logs)}
        />
      </div>

      {/* Sleep */}
      <div className="form-section">
        <h3>Sleep</h3>
        
        <div className="form-group">
          <label htmlFor="sleepHours">
            Sleep Hours
          </label>
          <input
            type="number"
            id="sleepHours"
            min="0"
            max="14"
            step="0.5"
            value={formData.sleepHours}
            onChange={(e) => updateField('sleepHours', parseFloat(e.target.value) || 0)}
            className={errors.sleepHours ? 'error' : ''}
          />
          {errors.sleepHours && <span className="error-message">{errors.sleepHours}</span>}
        </div>
      </div>

      {/* Notes */}
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="note">
            Notes (optional)
          </label>
          <textarea
            id="note"
            value={formData.note}
            onChange={(e) => updateField('note', e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Any additional thoughts or observations..."
            className={errors.note ? 'error' : ''}
          />
          <span className="char-count">{formData.note?.length || 0}/1000</span>
          {errors.note && <span className="error-message">{errors.note}</span>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary">
          Save Entry
        </button>
      </div>
    </form>
  );
};
