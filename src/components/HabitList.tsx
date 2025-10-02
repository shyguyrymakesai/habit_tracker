import React, { useState, useEffect } from 'react';
import { Habit, HabitLog } from '../lib/schemas';
import { getActiveHabits } from '../lib/habits';

interface HabitListProps {
  value: HabitLog[];
  onChange: (logs: HabitLog[]) => void;
}

export const HabitList: React.FC<HabitListProps> = ({ value, onChange }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const habitsList = await getActiveHabits();
      setHabits(habitsList);
      
      // Initialize logs for any new habits
      const existingIds = new Set(value.map(log => log.habitId));
      const newLogs = habitsList
        .filter(habit => !existingIds.has(habit.id))
        .map(habit => ({ habitId: habit.id, completed: false }));
      
      if (newLogs.length > 0) {
        onChange([...value, ...newLogs]);
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (habitId: string) => {
    const habit = getHabitInfo(habitId);
    if (!habit) return;

    const updatedLogs = value.map(log =>
      log.habitId === habitId
        ? { 
            ...log, 
            completed: !log.completed,
            // If uncompleting a time-based habit, clear minutes
            minutes: habit.isTimeBased && !log.completed ? 0 : log.minutes
          }
        : log
    );
    onChange(updatedLogs);
  };

  const handleMinutesChange = (habitId: string, minutes: number) => {
    const updatedLogs = value.map(log =>
      log.habitId === habitId
        ? { 
            ...log, 
            minutes: Math.max(0, minutes),
            completed: minutes > 0 // Auto-check if minutes > 0
          }
        : log
    );
    onChange(updatedLogs);
  };

  const handleMarkAllComplete = () => {
    const updatedLogs = value.map(log => ({ ...log, completed: true }));
    onChange(updatedLogs);
  };

  const handleClearAll = () => {
    const updatedLogs = value.map(log => ({ ...log, completed: false }));
    onChange(updatedLogs);
  };

  const getHabitInfo = (habitId: string) => {
    return habits.find(habit => habit.id === habitId);
  };

  if (loading) {
    return <div className="habit-list-loading">Loading habits...</div>;
  }

  if (habits.length === 0) {
    return (
      <div className="habit-list-empty">
        <p>No habits configured.</p>
        <p className="hint">Go to the Habits page to add your custom habits to track.</p>
      </div>
    );
  }

  const completedCount = value.filter(log => log.completed).length;
  const totalCount = habits.length;
  const totalMinutes = value.reduce((sum, log) => sum + (log.minutes || 0), 0);
  const hasTimeBased = habits.some(h => h.isTimeBased);

  return (
    <div className="habit-list">
      <div className="habit-header">
        <div>
          <h3>Daily Habits ({completedCount}/{totalCount})</h3>
          {hasTimeBased && totalMinutes > 0 && (
            <p className="time-summary">Total time: {totalMinutes} minutes</p>
          )}
        </div>
        <div className="habit-actions">
          <button
            type="button"
            onClick={handleMarkAllComplete}
            className="btn-small btn-success"
            disabled={completedCount === totalCount}
          >
            ✓ Complete All
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="btn-small btn-secondary"
            disabled={completedCount === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="habit-items">
        {value.map(log => {
          const habit = getHabitInfo(log.habitId);
          if (!habit) return null;

          return (
            <div
              key={habit.id}
              className={`habit-item ${log.completed ? 'completed' : ''} ${habit.isTimeBased ? 'time-based' : ''}`}
            >
              {!habit.isTimeBased ? (
                // Regular checkbox habit
                <>
                  <div className="habit-checkbox" onClick={() => handleToggle(habit.id)}>
                    <input
                      type="checkbox"
                      checked={log.completed}
                      onChange={() => handleToggle(habit.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="habit-info" onClick={() => handleToggle(habit.id)}>
                    <div className="habit-name">
                      {habit.icon && <span className="habit-icon">{habit.icon}</span>}
                      {habit.name}
                    </div>
                  </div>
                </>
              ) : (
                // Time-based input
                <>
                  <div className="habit-info-time">
                    <div className="habit-name">
                      {habit.icon && <span className="habit-icon">{habit.icon}</span>}
                      {habit.name}
                      <span className="time-label">⏱️</span>
                    </div>
                  </div>
                  <div className="habit-time-input">
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={log.minutes || 0}
                      onChange={(e) => handleMinutesChange(habit.id, parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="minutes-input"
                    />
                    <span className="minutes-label">min</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
