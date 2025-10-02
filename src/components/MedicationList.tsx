import React, { useState, useEffect } from 'react';
import { Medication, MedicationLog } from '../lib/schemas';
import { getActiveMedications, formatMedicationDose } from '../lib/medications';

interface MedicationListProps {
  value: MedicationLog[];
  onChange: (logs: MedicationLog[]) => void;
}

export const MedicationList: React.FC<MedicationListProps> = ({ value, onChange }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const meds = await getActiveMedications();
      setMedications(meds);
      
      // Initialize logs for any new medications
      const existingIds = new Set(value.map(log => log.medicationId));
      const newLogs = meds
        .filter(med => !existingIds.has(med.id))
        .map(med => ({ medicationId: med.id, taken: false }));
      
      if (newLogs.length > 0) {
        onChange([...value, ...newLogs]);
      }
    } catch (error) {
      console.error('Failed to load medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (medicationId: string) => {
    const updatedLogs = value.map(log =>
      log.medicationId === medicationId
        ? { ...log, taken: !log.taken }
        : log
    );
    onChange(updatedLogs);
  };

  const handleMarkAllTaken = () => {
    const updatedLogs = value.map(log => ({ ...log, taken: true }));
    onChange(updatedLogs);
  };

  const handleClearAll = () => {
    const updatedLogs = value.map(log => ({ ...log, taken: false }));
    onChange(updatedLogs);
  };

  const getMedicationInfo = (medId: string) => {
    return medications.find(med => med.id === medId);
  };

  const getTimingEmoji = (timing: 'morning' | 'night' | 'both') => {
    switch (timing) {
      case 'morning':
        return '☀️';
      case 'night':
        return '🌙';
      case 'both':
        return '☀️🌙';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="medication-list-loading">Loading medications...</div>;
  }

  if (medications.length === 0) {
    return (
      <div className="medication-list-empty">
        <p>No medications configured.</p>
        <p className="hint">Go to the Medications page to add your medications and supplements.</p>
      </div>
    );
  }

  const takenCount = value.filter(log => log.taken).length;
  const totalCount = medications.length;

  return (
    <div className="medication-list">
      <div className="medication-header">
        <h3>Medications ({takenCount}/{totalCount})</h3>
        <div className="medication-actions">
          <button
            type="button"
            onClick={handleMarkAllTaken}
            className="btn-small btn-success"
            disabled={takenCount === totalCount}
          >
            ✓ Mark All Taken
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="btn-small btn-secondary"
            disabled={takenCount === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="medication-items">
        {value.map(log => {
          const med = getMedicationInfo(log.medicationId);
          if (!med) return null;

          return (
            <div
              key={med.id}
              className={`medication-item ${log.taken ? 'taken' : ''}`}
              onClick={() => handleToggle(med.id)}
            >
              <div className="medication-checkbox">
                <input
                  type="checkbox"
                  checked={log.taken}
                  onChange={() => handleToggle(med.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="medication-info">
                <div className="medication-name">
                  {med.name}
                  <span className="medication-timing">
                    {getTimingEmoji(med.timing)}
                  </span>
                </div>
                <div className="medication-dose">{formatMedicationDose(med) || '—'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
