import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Rating, RatingSchema } from '../lib/schemas';
import { 
  getAllRatings, 
  saveRating, 
  deleteRating,
  toggleRatingActive 
} from '../lib/ratings';

// Common emoji suggestions for ratings
const EMOJI_SUGGESTIONS = [
  '😊', '💪', '🧠', '❤️', '⚡', '🎯', '🌟', '💯', 
  '😴', '🍎', '💧', '🔥', '⭐', '📊', '🎨', '✨',
  '🌈', '☀️', '🌙', '💡', '🚀', '🎵', '🏆', '💖',
  '😰', '🍕'
];

export const RatingSettings: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    minValue: 0,
    maxValue: 10,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const ratingsList = await getAllRatings();
      setRatings(ratingsList);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', icon: '', minValue: 0, maxValue: 10 });
    setErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate range
    if (formData.minValue >= formData.maxValue) {
      setErrors({ minValue: 'Min must be less than Max' });
      return;
    }

    const rating: Rating = {
      id: editingId || uuidv4(),
      name: formData.name.trim(),
      icon: formData.icon.trim() || undefined,
      minValue: formData.minValue,
      maxValue: formData.maxValue,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const result = RatingSchema.safeParse(rating);

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
      await saveRating(result.data);
      await loadRatings();
      resetForm();
    } catch (error) {
      console.error('Failed to save rating:', error);
      alert('Failed to save rating. Please try again.');
    }
  };

  const handleEdit = (rating: Rating) => {
    setFormData({
      name: rating.name,
      icon: rating.icon || '',
      minValue: rating.minValue,
      maxValue: rating.maxValue,
    });
    setEditingId(rating.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    try {
      await deleteRating(id);
      await loadRatings();
    } catch (error) {
      console.error('Failed to delete rating:', error);
      alert('Failed to delete rating. Please try again.');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleRatingActive(id);
      await loadRatings();
    } catch (error) {
      console.error('Failed to toggle rating:', error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setFormData({ ...formData, icon: emoji });
  };

  return (
    <div className="rating-settings-page">
      <h1>📊 Ratings</h1>
      <p className="page-description">
        Create custom metrics to track on a scale. These will appear in your daily entry form as sliders.
      </p>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary add-rating-btn"
        >
          + Add Rating
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="rating-form">
          <h3>{editingId ? 'Edit Rating' : 'Add New Rating'}</h3>

          <div className="form-group">
            <label htmlFor="name">Rating Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Mood, Energy, Focus, Stress"
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
              placeholder="e.g., 😊 💪 🧠"
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minValue">Minimum Value *</label>
              <input
                type="number"
                id="minValue"
                value={formData.minValue}
                onChange={(e) => setFormData({ ...formData, minValue: parseInt(e.target.value) || 0 })}
                className={errors.minValue ? 'error' : ''}
              />
              {errors.minValue && <span className="error-message">{errors.minValue}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="maxValue">Maximum Value *</label>
              <input
                type="number"
                id="maxValue"
                value={formData.maxValue}
                onChange={(e) => setFormData({ ...formData, maxValue: parseInt(e.target.value) || 10 })}
                className={errors.maxValue ? 'error' : ''}
              />
              {errors.maxValue && <span className="error-message">{errors.maxValue}</span>}
            </div>
          </div>

          <p className="form-hint">
            Common ranges: 0-10, 1-10, 0-5, 1-5
          </p>

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Add'} Rating
            </button>
          </div>
        </form>
      )}

      <div className="ratings-list">
        <h3>Your Ratings</h3>
        {ratings.length === 0 ? (
          <p className="empty-state">No ratings added yet. Start by adding your first metric!</p>
        ) : (
          <div className="rating-cards">
            {ratings.map((rating) => (
              <div key={rating.id} className={`rating-card ${!rating.active ? 'inactive' : ''}`}>
                <div className="rating-card-header">
                  <h4>
                    {rating.icon && <span className="rating-card-icon">{rating.icon}</span>}
                    {rating.name}
                  </h4>
                </div>
                <div className="rating-card-range">
                  Range: {rating.minValue} - {rating.maxValue}
                </div>
                <div className="rating-card-actions">
                  <button
                    onClick={() => handleToggleActive(rating.id)}
                    className={`btn-small ${rating.active ? 'btn-warning' : 'btn-success'}`}
                  >
                    {rating.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(rating)}
                    className="btn-small btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rating.id)}
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
