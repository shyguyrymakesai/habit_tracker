import React, { useState, useEffect } from 'react';
import { Rating, RatingLog } from '../lib/schemas';
import { getActiveRatings } from '../lib/ratings';

interface RatingListProps {
  value: RatingLog[];
  onChange: (logs: RatingLog[]) => void;
}

export const RatingList: React.FC<RatingListProps> = ({ value, onChange }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const ratingsList = await getActiveRatings();
      setRatings(ratingsList);
      
      // Initialize logs for any new ratings
      const existingIds = new Set(value.map(log => log.ratingId));
      const newLogs = ratingsList
        .filter(rating => !existingIds.has(rating.id))
        .map(rating => ({ 
          ratingId: rating.id, 
          value: Math.floor((rating.minValue + rating.maxValue) / 2) // default to middle
        }));
      
      if (newLogs.length > 0) {
        onChange([...value, ...newLogs]);
      }
    } catch (error) {
      console.error('Failed to load ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (ratingId: string, newValue: number) => {
    const updatedLogs = value.map(log =>
      log.ratingId === ratingId
        ? { ...log, value: newValue }
        : log
    );
    onChange(updatedLogs);
  };

  const getRatingInfo = (ratingId: string) => {
    return ratings.find(rating => rating.id === ratingId);
  };

  if (loading) {
    return <div className="rating-list-loading">Loading ratings...</div>;
  }

  if (ratings.length === 0) {
    return (
      <div className="rating-list-empty">
        <p>No ratings configured.</p>
        <p className="hint">Go to the Ratings page to add custom metrics to track.</p>
      </div>
    );
  }

  return (
    <div className="rating-list">
      <h3>Ratings</h3>
      
      <div className="rating-items">
        {value.map(log => {
          const rating = getRatingInfo(log.ratingId);
          if (!rating) return null;

          return (
            <div key={rating.id} className="rating-item">
              <div className="rating-header-row">
                <label htmlFor={`rating-${rating.id}`} className="rating-label">
                  {rating.icon && <span className="rating-icon">{rating.icon}</span>}
                  {rating.name}
                </label>
                <span className="rating-value-display">
                  {log.value}/{rating.maxValue}
                </span>
              </div>
              <div className="rating-input-row">
                <span className="rating-min">{rating.minValue}</span>
                <input
                  type="range"
                  id={`rating-${rating.id}`}
                  min={rating.minValue}
                  max={rating.maxValue}
                  value={log.value}
                  onChange={(e) => handleValueChange(rating.id, parseInt(e.target.value))}
                  className="rating-slider"
                />
                <span className="rating-max">{rating.maxValue}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
