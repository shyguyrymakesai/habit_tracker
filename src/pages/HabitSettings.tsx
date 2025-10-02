import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitSchema } from '../lib/schemas';
import { 
  getAllHabits, 
  saveHabit, 
  deleteHabit,
  toggleHabitActive 
} from '../lib/habits';

// Common emoji suggestions for habits
const EMOJI_SUGGESTIONS = [
  '💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '✍️', 
  '🎯', '💡', '🌱', '🎨', '🎵', '🧠', '❤️', '☀️',
  '🌙', '🏋️', '🚴', '🧼', '🪥', '🎮', '📝', '☕'
];

export const HabitSettings: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    isTimeBased: false,
    weeklyGoalMinutes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const habitsList = await getAllHabits();
      setHabits(habitsList);
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', icon: '', isTimeBased: false, weeklyGoalMinutes: '' });
    setErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weeklyGoal = formData.weeklyGoalMinutes.trim() 
      ? parseInt(formData.weeklyGoalMinutes) 
      : undefined;

    const habit: Habit = {
      id: editingId || uuidv4(),
      name: formData.name.trim(),
      icon: formData.icon.trim() || undefined,
      isTimeBased: formData.isTimeBased,
      weeklyGoalMinutes: weeklyGoal,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const result = HabitSchema.safeParse(habit);

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
      await saveHabit(result.data);
      await loadHabits();
      resetForm();
    } catch (error) {
      console.error('Failed to save habit:', error);
      alert('Failed to save habit. Please try again.');
    }
  };

  const handleEdit = (habit: Habit) => {
    setFormData({
      name: habit.name,
      icon: habit.icon || '',
      isTimeBased: habit.isTimeBased,
      weeklyGoalMinutes: habit.weeklyGoalMinutes?.toString() || '',
    });
    setEditingId(habit.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) {
      return;
    }

    try {
      await deleteHabit(id);
      await loadHabits();
    } catch (error) {
      console.error('Failed to delete habit:', error);
      alert('Failed to delete habit. Please try again.');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleHabitActive(id);
      await loadHabits();
    } catch (error) {
      console.error('Failed to toggle habit:', error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setFormData({ ...formData, icon: emoji });
  };

  return (
    <div className="habit-settings-page">
      <h1>🎯 Habits</h1>
      <p className="page-description">
        Create and manage your daily habits. These will appear in your daily entry form for tracking.
      </p>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary add-habit-btn"
        >
          + Add Habit
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="habit-form">
          <h3>{editingId ? 'Edit Habit' : 'Add New Habit'}</h3>

          <div className="form-group">
            <label htmlFor="name">Habit Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Exercise, Read, Meditate"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icon (optional emoji)</label>
            <input
              type="text"
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., 💪 🏃 📚"
              maxLength={10}
              className={errors.icon ? 'error' : ''}
            />
            {errors.icon && <span className="error-message">{errors.icon}</span>}
            
            <div className="emoji-picker">
              <span className="emoji-label">Quick pick:</span>
              {EMOJI_SUGGESTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="emoji-btn"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isTimeBased}
                onChange={(e) => setFormData({ ...formData, isTimeBased: e.target.checked })}
              />
              <span>Time-based activity (track minutes instead of completion)</span>
            </label>
            <p className="form-hint">
              Enable this for activities where you track duration (e.g., "Read for 30 minutes", "Exercise for 45 minutes")
            </p>
          </div>

          {formData.isTimeBased && (
            <div className="form-group">
              <label htmlFor="weeklyGoal">Weekly Goal (minutes)</label>
              <input
                type="number"
                id="weeklyGoal"
                value={formData.weeklyGoalMinutes}
                onChange={(e) => setFormData({ ...formData, weeklyGoalMinutes: e.target.value })}
                placeholder="e.g., 150"
                min="0"
                className={errors.weeklyGoalMinutes ? 'error' : ''}
              />
              {errors.weeklyGoalMinutes && <span className="error-message">{errors.weeklyGoalMinutes}</span>}
              <p className="form-hint">
                Optional: Set a weekly target in minutes (e.g., 150 minutes = 2.5 hours per week)
              </p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Add'} Habit
            </button>
          </div>
        </form>
      )}

      <div className="habits-list">
        <h3>Your Habits</h3>
        {habits.length === 0 ? (
          <p className="empty-state">No habits added yet. Start by adding your first habit!</p>
        ) : (
          <div className="habit-cards">
            {habits.map((habit) => (
              <div key={habit.id} className={`habit-card ${!habit.active ? 'inactive' : ''}`}>
                <div className="habit-card-header">
                  <h4>
                    {habit.icon && <span className="habit-card-icon">{habit.icon}</span>}
                    {habit.name}
                    {habit.isTimeBased && <span className="time-badge">⏱️ Time-based</span>}
                  </h4>
                  {habit.isTimeBased && habit.weeklyGoalMinutes && (
                    <p className="habit-goal">
                      Weekly goal: {habit.weeklyGoalMinutes} minutes
                      {habit.weeklyGoalMinutes >= 60 && ` (${(habit.weeklyGoalMinutes / 60).toFixed(1)} hrs)`}
                    </p>
                  )}
                </div>
                <div className="habit-card-actions">
                  <button
                    onClick={() => handleToggleActive(habit.id)}
                    className={`btn-small ${habit.active ? 'btn-warning' : 'btn-success'}`}
                  >
                    {habit.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(habit)}
                    className="btn-small btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
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
