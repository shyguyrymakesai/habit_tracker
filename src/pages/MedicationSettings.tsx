import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Medication, MedicationSchema } from '../lib/schemas';
import { 
  getAllMedications, 
  saveMedication, 
  deleteMedication,
  toggleMedicationActive,
  formatMedicationDose,
  inferDoseUnitFromString,
  extractDoseAmountFromString,
} from '../lib/medications';

type DoseUnit = Medication['doseUnit'];

const DOSE_UNIT_OPTIONS: { value: DoseUnit; label: string }[] = [
  { value: 'mg', label: 'mg (milligrams)' },
  { value: 'g', label: 'g (grams)' },
  { value: 'ug', label: 'µg (micrograms)' },
];

type MedicationFormData = {
  name: string;
  doseAmount: string;
  doseUnit: DoseUnit;
  timing: 'morning' | 'night' | 'both';
};

export const MedicationSettings: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MedicationFormData>({
    name: '',
    doseAmount: '',
    doseUnit: 'mg' as DoseUnit,
    timing: 'morning' as 'morning' | 'night' | 'both',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const meds = await getAllMedications();
      setMedications(meds);
    } catch (error) {
      console.error('Failed to load medications:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', doseAmount: '', doseUnit: 'mg' as DoseUnit, timing: 'morning' });
    setErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedDoseAmount = parseFloat(formData.doseAmount);
    const sanitizedDoseAmount = Number.isFinite(parsedDoseAmount) ? parsedDoseAmount : undefined;

    const displayUnit = formData.doseUnit;
    const doseString = sanitizedDoseAmount !== undefined
      ? `${Number.isInteger(sanitizedDoseAmount) ? sanitizedDoseAmount : parseFloat(sanitizedDoseAmount.toFixed(2))} ${displayUnit === 'ug' ? 'µg' : displayUnit}`
      : '';

    const existingMedication = editingId
      ? medications.find((med) => med.id === editingId)
      : undefined;

    const medication: Medication = {
      id: editingId || uuidv4(),
      name: formData.name.trim(),
      doseAmount: sanitizedDoseAmount,
      doseUnit: displayUnit,
      dose: doseString || existingMedication?.dose,
      timing: formData.timing,
      active: existingMedication?.active ?? true,
      createdAt: existingMedication?.createdAt ?? new Date().toISOString(),
    };

    const result = MedicationSchema.safeParse(medication);

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

    try {
      await saveMedication(result.data);
      await loadMedications();
      resetForm();
    } catch (error) {
      console.error('Failed to save medication:', error);
      alert('Failed to save medication. Please try again.');
    }
  };

  const handleEdit = (med: Medication) => {
    const unit = med.doseUnit ?? inferDoseUnitFromString(med.dose);
    const amountString = med.doseAmount !== undefined
      ? `${med.doseAmount}`
      : extractDoseAmountFromString(med.dose);

    setFormData({
      name: med.name,
      doseAmount: amountString,
      doseUnit: unit,
      timing: med.timing,
    });
    setEditingId(med.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medication?')) {
      return;
    }

    try {
      await deleteMedication(id);
      await loadMedications();
    } catch (error) {
      console.error('Failed to delete medication:', error);
      alert('Failed to delete medication. Please try again.');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleMedicationActive(id);
      await loadMedications();
    } catch (error) {
      console.error('Failed to toggle medication:', error);
    }
  };

  const getTimingLabel = (timing: 'morning' | 'night' | 'both') => {
    switch (timing) {
      case 'morning':
        return '☀️ Morning';
      case 'night':
        return '🌙 Night';
      case 'both':
        return '☀️🌙 Morning & Night';
    }
  };

  return (
    <div className="medication-settings-page">
      <h1>💊 Medications</h1>
      <p className="page-description">
        Manage your medications and supplements. These will appear in your daily entry form for tracking.
      </p>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary add-medication-btn"
        >
          + Add Medication
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="medication-form">
          <h3>{editingId ? 'Edit Medication' : 'Add New Medication'}</h3>

          <div className="form-group">
            <label htmlFor="name">Medication/Supplement Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Vitamin D, Aspirin"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="doseAmount">Dose *</label>
            <div className="dose-input-row">
              <input
                type="number"
                id="doseAmount"
                min="0.001"
                step="0.001"
                value={formData.doseAmount}
                onChange={(e) => setFormData({ ...formData, doseAmount: e.target.value })}
                placeholder="e.g., 500"
                className={errors.doseAmount ? 'error' : ''}
              />
              <select
                id="doseUnit"
                value={formData.doseUnit}
                onChange={(e) => setFormData({ ...formData, doseUnit: e.target.value as DoseUnit })}
              >
                {DOSE_UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.doseAmount && <span className="error-message">{errors.doseAmount}</span>}
            <p className="form-hint">Enter the numeric amount and choose mg (default), g, or µg.</p>
          </div>

          <div className="form-group">
            <label htmlFor="timing">When to Take *</label>
            <select
              id="timing"
              value={formData.timing}
              onChange={(e) => setFormData({ ...formData, timing: e.target.value as any })}
            >
              <option value="morning">☀️ Morning</option>
              <option value="night">🌙 Night</option>
              <option value="both">☀️🌙 Morning & Night</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Add'} Medication
            </button>
          </div>
        </form>
      )}

      <div className="medications-list">
        <h3>Your Medications</h3>
        {medications.length === 0 ? (
          <p className="empty-state">No medications added yet.</p>
        ) : (
          <div className="medication-cards">
            {medications.map((med) => (
              <div key={med.id} className={`medication-card ${!med.active ? 'inactive' : ''}`}>
                <div className="medication-card-header">
                  <h4>{med.name}</h4>
                  <span className="medication-card-timing">
                    {getTimingLabel(med.timing)}
                  </span>
                </div>
                <div className="medication-card-dose">
                  <strong>Dose:</strong> {formatMedicationDose(med) || '—'}
                </div>
                <div className="medication-card-actions">
                  <button
                    onClick={() => handleToggleActive(med.id)}
                    className={`btn-small ${med.active ? 'btn-warning' : 'btn-success'}`}
                  >
                    {med.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(med)}
                    className="btn-small btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="btn-small btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
