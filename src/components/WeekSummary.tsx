import React from 'react';

interface WeekSummaryProps {
  weekData?: Array<{
    date: string;
    completed: boolean;
  }>;
}

export const WeekSummary: React.FC<WeekSummaryProps> = ({ weekData = [] }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="week-summary">
      <h3>This Week</h3>
      <div className="week-grid">
        {days.map((day, index) => (
          <div key={day} className="day-cell">
            <span className="day-label">{day}</span>
            <div className={`day-indicator ${weekData[index]?.completed ? 'completed' : ''}`}>
              {/* Visual indicator */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
