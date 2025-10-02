import React, { useState, useEffect, useMemo } from 'react';
import { DailyEntry, Habit, Medication, Rating } from '../lib/schemas';
import { getAllEntries, deleteEntry } from '../lib/db';
import { getAllHabits } from '../lib/habits';
import { getAllMedications } from '../lib/medications';
import { getAllRatings } from '../lib/ratings';
import { useNavigate } from '../lib/navigation';

type TimeFilter = 'all' | 'week' | 'month' | 'year';

interface HabitMap {
  [id: string]: Habit;
}

interface MedicationMap {
  [id: string]: Medication;
}

interface RatingMap {
  [id: string]: Rating;
}

export const History: React.FC = () => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [habits, setHabits] = useState<HabitMap>({});
  const [medications, setMedications] = useState<MedicationMap>({});
  const [ratings, setRatings] = useState<RatingMap>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<TimeFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const [entryList, habitList, medicationList, ratingList] = await Promise.all([
        getAllEntries(),
        getAllHabits(),
        getAllMedications(),
        getAllRatings(),
      ]);

      setEntries(entryList);
      setHabits(
        habitList.reduce<HabitMap>((map, habit) => {
          map[habit.id] = habit;
          return map;
        }, {})
      );
      setMedications(
        medicationList.reduce<MedicationMap>((map, medication) => {
          map[medication.id] = medication;
          return map;
        }, {})
      );
      setRatings(
        ratingList.reduce<RatingMap>((map, rating) => {
          map[rating.id] = rating;
          return map;
        }, {})
      );
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const now = new Date();
    let startDate: Date | null = null;

    if (filter === 'week') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
    } else if (filter === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filter === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const startDateString = startDate
      ? startDate.toISOString().split('T')[0]
      : null;

    return entries
      .filter((entry) => {
        if (startDateString && entry.date < startDateString) {
          return false;
        }

        if (!term) {
          return true;
        }

        if (entry.note && entry.note.toLowerCase().includes(term)) {
          return true;
        }

        const habitMatch = entry.habits.some((log) => {
          const habit = habits[log.habitId];
          return habit && habit.name.toLowerCase().includes(term);
        });
        if (habitMatch) return true;

        const medicationMatch = entry.medications.some((log) => {
          const medication = medications[log.medicationId];
          return medication && medication.name.toLowerCase().includes(term);
        });
        if (medicationMatch) return true;

        const ratingMatch = entry.ratings.some((log) => {
          const rating = ratings[log.ratingId];
          if (!rating) return false;
          const valueMatch = log.value.toString().includes(term);
          return (
            rating.name.toLowerCase().includes(term) ||
            valueMatch
          );
        });

        return ratingMatch;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, habits, medications, ratings, searchTerm, filter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = async (date: string) => {
    if (!confirm('Delete this entry?')) {
      return;
    }
    try {
      await deleteEntry(date);
      await loadHistory();
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const handleEdit = (date: string) => {
    navigate('/');
    localStorage.setItem('habit-tracker-edit-date', date);
  };

  const renderHabitSummary = (entry: DailyEntry) => {
    if (entry.habits.length === 0) {
      return <p className="muted">No habits logged.</p>;
    }

    return (
      <ul className="history-habit-list">
        {entry.habits.map((log) => {
          const habit = habits[log.habitId];
          if (!habit) return null;

          const status = habit.isTimeBased
            ? `${log.minutes ?? 0} min`
            : log.completed
            ? 'Completed'
            : 'Not completed';

          return (
            <li key={`${entry.date}-${habit.id}`}>
              <span className="history-habit-name">
                {habit.icon ? `${habit.icon} ` : ''}{habit.name}
              </span>
              <span className={`history-habit-status ${log.completed || (habit.isTimeBased && (log.minutes ?? 0) > 0) ? 'done' : 'missed'}`}>
                {status}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderMedicationSummary = (entry: DailyEntry) => {
    if (entry.medications.length === 0) {
      return <p className="muted">No medications tracked.</p>;
    }

    return (
      <ul className="history-medication-list">
        {entry.medications.map((log) => {
          const medication = medications[log.medicationId];
          if (!medication) return null;

          return (
            <li key={`${entry.date}-${medication.id}`}>
              <span className="history-medication-name">{medication.name}</span>
              <span className={`history-medication-status ${log.taken ? 'taken' : 'missed'}`}>
                {log.taken ? 'Taken' : 'Skipped'}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderRatingSummary = (entry: DailyEntry) => {
    if (entry.ratings.length === 0) {
      return <p className="muted">No ratings logged.</p>;
    }

    return (
      <ul className="history-rating-list">
        {entry.ratings.map((log) => {
          const rating = ratings[log.ratingId];
          if (!rating) return null;

          return (
            <li key={`${entry.date}-${rating.id}`}>
              <span className="history-rating-name">
                {rating.icon ? `${rating.icon} ` : ''}{rating.name}
              </span>
              <span className="history-rating-value">
                {log.value}/{rating.maxValue}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="history-page">
      <h1>Entry History</h1>

      <div className="history-filters">
        <input
          type="search"
          placeholder="Search entries..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as TimeFilter)}>
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading history...</p>
      ) : (
        <div className="entries-list">
          {filteredEntries.length === 0 ? (
            <p>No entries found for the selected filters.</p>
          ) : (
            filteredEntries.map((entry) => (
              <div key={entry.date} className="entry-item">
                <div className="entry-item-header">
                  <div>
                    <div className="entry-date">{formatDate(entry.date)}</div>
                    <div className="entry-subtitle">Sleep: {entry.sleepHours} hrs</div>
                  </div>
                  <div className="entry-actions">
                    <button onClick={() => handleEdit(entry.date)} className="btn-small btn-secondary">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(entry.date)} className="btn-small btn-danger">
                      Delete
                    </button>
                  </div>
                </div>

                <div className="entry-section">
                  <h4>Habits</h4>
                  {renderHabitSummary(entry)}
                </div>

                <div className="entry-section">
                  <h4>Medications</h4>
                  {renderMedicationSummary(entry)}
                </div>

                <div className="entry-section">
                  <h4>Ratings</h4>
                  {renderRatingSummary(entry)}
                </div>

                {entry.note && (
                  <div className="entry-section">
                    <h4>Notes</h4>
                    <p>{entry.note}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
