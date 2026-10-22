
import React, { useEffect, useState } from 'react';

function generateTripDays(startDate, endDate) {
  if (!startDate || !endDate) return [];

  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);

  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);

  const diffDays =
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

  const totalDays = Math.max(1, Math.min(diffDays, 60));

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return Array.from({ length: totalDays }, (_, i) => {
    const current = new Date(sy, sm - 1, sd + i);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const date = String(current.getDate()).padStart(2, '0');

    return {
      dayIndex: i,
      dayNumber: i + 1,
      date: `${year}-${month}-${date}`,
      shortDate: `${monthNames[current.getMonth()]} ${current.getDate()}`,
      fullDate: `${dayNames[current.getDay()]}, ${
        monthNames[current.getMonth()]
      } ${current.getDate()}, ${year}`,
    };
  });
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function getActivityCost(activity) {
  if (
    activity.cost === '' ||
    activity.cost === null ||
    activity.cost === undefined
  ) {
    return 0;
  }

  const cost = Number(activity.cost);

  return Number.isFinite(cost) && cost >= 0 ? cost : 0;
}

function TripDetails({
  trip,
  onBack,
  onEditTrip,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onSaveTripBudget,
  onReorderActivities,
}) {
  const {
    name,
    tripName,
    destination,
    startDate,
    endDate,
    dates,
    duration,
    badge,
    emoji,
    activities = [],
    budget,
  } = trip;

  const tripTitle = name || tripName || 'My Journey';
  const displayDates = dates || `${startDate} – ${endDate}`;
  const days = generateTripDays(startDate, endDate);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activityName, setActivityName] = useState('');
  const [activityTime, setActivityTime] = useState('');
  const [activityCost, setActivityCost] = useState('');
  const [activityNotes, setActivityNotes] = useState('');
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [formError, setFormError] = useState('');

  const [budgetInput, setBudgetInput] = useState(
    budget === null || budget === undefined ? '' : String(budget)
  );
  const [budgetMessage, setBudgetMessage] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [draggedActivityId, setDraggedActivityId] = useState(null);
  const [dragOverActivityId, setDragOverActivityId] = useState(null);

  useEffect(() => {
    setBudgetInput(
      budget === null || budget === undefined ? '' : String(budget)
    );
  }, [trip.id, budget]);

  const isEditingActivity = editingActivityId !== null;

  const activeDay = days[selectedDayIndex] || days[0] || {
    dayNumber: 1,
    date: startDate || '',
    fullDate: displayDates,
    shortDate: '',
  };

  // Keep the saved order. Users can reorder activities by dragging them.
  const dayActivities = activities.filter(
    (activity) => activity.date === activeDay.date
  );

  const dayTotal = dayActivities.reduce(
    (total, activity) => total + getActivityCost(activity),
    0
  );

  const tripTotal = activities.reduce(
    (total, activity) => total + getActivityCost(activity),
    0
  );

  const hasBudget =
    budget !== null &&
    budget !== undefined &&
    budget !== '' &&
    Number.isFinite(Number(budget)) &&
    Number(budget) >= 0;

  const numericBudget = hasBudget ? Number(budget) : 0;
  const remainingBudget = numericBudget - tripTotal;
  const budgetPercentage =
    hasBudget && numericBudget > 0
      ? Math.min((tripTotal / numericBudget) * 100, 100)
      : hasBudget && tripTotal > 0
        ? 100
        : 0;

  const isOverBudget = hasBudget && tripTotal > numericBudget;

  const resetActivityForm = () => {
    setActivityName('');
    setActivityTime('');
    setActivityCost('');
    setActivityNotes('');
    setEditingActivityId(null);
    setFormError('');
  };

  const handleEditActivity = (activity) => {
    setEditingActivityId(activity.id);
    setActivityName(activity.name || '');
    setActivityTime(activity.time || '');
    setActivityCost(
      activity.cost === null || activity.cost === undefined
        ? ''
        : String(activity.cost)
    );
    setActivityNotes(activity.notes || '');
    setFormError('');

    document
      .getElementById('activity-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleCancelActivityEdit = () => {
    resetActivityForm();
  };

  const handleSubmitActivity = (event) => {
    event.preventDefault();
    setFormError('');

    if (!activityName.trim() || !activityTime) {
      setFormError('Please enter an activity name and time.');
      return;
    }

    if (
      activityCost.trim() !== '' &&
      (!Number.isFinite(Number(activityCost)) ||
        Number(activityCost) < 0)
    ) {
      setFormError('Enter a valid cost of 0 or more.');
      return;
    }

    const activityData = {
      name: activityName.trim(),
      time: activityTime,
      cost: activityCost.trim() === '' ? '' : Number(activityCost),
      notes: activityNotes.trim(),
      date: activeDay.date,
    };

    if (isEditingActivity) {
      if (typeof onUpdateActivity !== 'function') {
        setFormError('Unable to update this activity right now.');
        return;
      }

      const success = onUpdateActivity(
        trip.id,
        editingActivityId,
        activityData
      );

      if (!success) {
        setFormError(
          'Could not update this activity. Please check the details.'
        );
        return;
      }

      resetActivityForm();
      return;
    }

    if (typeof onAddActivity !== 'function') {
      setFormError('Unable to add activities right now.');
      return;
    }

    const success = onAddActivity(trip.id, activityData);

    if (!success) {
      setFormError('Could not add this activity. Please check the details.');
      return;
    }

    resetActivityForm();
  };

  const handleSaveBudget = (event) => {
    event.preventDefault();
    setBudgetError('');
    setBudgetMessage('');

    if (budgetInput.trim() !== '') {
      const value = Number(budgetInput);

      if (!Number.isFinite(value) || value < 0) {
        setBudgetError('Enter a valid budget of 0 or more.');
        return;
      }
    }

    if (typeof onSaveTripBudget !== 'function') {
      setBudgetError('Unable to save your budget right now.');
      return;
    }

    const success = onSaveTripBudget(
      trip.id,
      budgetInput.trim() === '' ? null : Number(budgetInput)
    );

    if (!success) {
      setBudgetError('Could not save the budget. Please try again.');
      return;
    }

    setBudgetMessage(
      budgetInput.trim() === '' ? 'Budget removed.' : 'Budget saved!'
    );
  };

  const handleDragStart = (event, activityId) => {
    if (!trip.isUserCreated) {
      event.preventDefault();
      return;
    }

    setDraggedActivityId(activityId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', activityId);
  };

  const handleDragOver = (event, activityId) => {
    event.preventDefault();

    if (activityId !== draggedActivityId) {
      setDragOverActivityId(activityId);
    }

    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event, targetActivityId) => {
    event.preventDefault();

    const sourceActivityId =
      draggedActivityId || event.dataTransfer.getData('text/plain');

    setDragOverActivityId(null);
    setDraggedActivityId(null);

    if (
      !sourceActivityId ||
      sourceActivityId === targetActivityId ||
      typeof onReorderActivities !== 'function'
    ) {
      return;
    }

    const reordered = [...dayActivities];
    const sourceIndex = reordered.findIndex(
      (activity) => activity.id === sourceActivityId
    );
    const targetIndex = reordered.findIndex(
      (activity) => activity.id === targetActivityId
    );

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [movedActivity] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedActivity);

    onReorderActivities(
      trip.id,
      activeDay.date,
      reordered.map((activity) => activity.id)
    );
  };

  const handleDragEnd = () => {
    setDraggedActivityId(null);
    setDragOverActivityId(null);
  };

  return (
    <div className="trip-details-page">
      <div className="trip-details-container">
        <div className="trip-details-nav">
          <button
            type="button"
            className="btn-back-trips"
            onClick={onBack}
            aria-label="Back to Trips"
          >
            <svg
              className="back-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Trips</span>
          </button>
        </div>

        <header className="trip-overview-card">
          <div className="trip-overview-top">
            <div className="overview-emoji" aria-hidden="true">
              {emoji || '✈️ 🗺️'}
            </div>

            <span className="overview-badge">{badge || 'My Trip'}</span>
          </div>

          <h1 className="overview-title">{tripTitle}</h1>

          {trip.isUserCreated && (
            <button
              type="button"
              className="btn-create-trip"
              onClick={() => onEditTrip?.(trip.id)}
            >
              ✏️ Edit Trip
            </button>
          )}

          <div className="overview-destination">
            <span className="destination-pin">📍</span>
            <span>{destination}</span>
          </div>

          <div className="overview-meta-row">
            <div className="meta-item">
              <svg
                className="meta-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{displayDates}</span>
            </div>

            <div className="meta-divider" aria-hidden="true">•</div>

            <div className="meta-item">
              <svg
                className="meta-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{duration || `${days.length} Days`}</span>
            </div>
          </div>
        </header>

        {trip.isUserCreated && (
          <section className="budget-card" aria-labelledby="budget-title">
            <div className="budget-card-heading">
              <div>
                <p className="budget-eyebrow">TRIP FINANCES</p>
                <h2 id="budget-title" className="budget-title">
                  💰 Trip Budget
                </h2>
                <p className="budget-description">
                  Set a spending limit and keep your trip costs under control.
                </p>
              </div>
            </div>

            <form className="budget-form" onSubmit={handleSaveBudget}>
              <label className="budget-field">
                <span>Budget amount (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={budgetInput}
                  onChange={(event) => {
                    setBudgetInput(event.target.value);
                    setBudgetMessage('');
                    setBudgetError('');
                  }}
                  placeholder="e.g. 15000"
                  aria-label="Trip budget in rupees"
                />
              </label>

              <button type="submit" className="budget-save-btn">
                Save Budget
              </button>
            </form>

            {budgetError && (
              <p className="budget-feedback budget-feedback--error" role="alert">
                {budgetError}
              </p>
            )}

            {budgetMessage && (
              <p className="budget-feedback" role="status">
                {budgetMessage}
              </p>
            )}

            <div className="budget-stats">
              <div className="budget-stat">
                <span>Total spent</span>
                <strong>₹{formatMoney(tripTotal)}</strong>
              </div>

              <div className="budget-stat">
                <span>{hasBudget ? 'Your budget' : 'Budget not set'}</span>
                <strong>
                  {hasBudget ? `₹${formatMoney(numericBudget)}` : '—'}
                </strong>
              </div>

              <div className="budget-stat">
                <span>{isOverBudget ? 'Over budget' : 'Remaining'}</span>
                <strong
                  className={
                    isOverBudget ? 'budget-over-limit' : 'budget-remaining'
                  }
                >
                  {hasBudget
                    ? `${isOverBudget ? '−' : ''}₹${formatMoney(
                        Math.abs(remainingBudget)
                      )}`
                    : '—'}
                </strong>
              </div>
            </div>

            {hasBudget && (
              <div className="budget-progress-section">
                <div className="budget-progress-labels">
                  <span>Budget used</span>
                  <strong>
                    {numericBudget === 0
                      ? tripTotal > 0
                        ? 'Over limit'
                        : '0%'
                      : `${Math.round((tripTotal / numericBudget) * 100)}%`}
                  </strong>
                </div>

                <div
                  className={`budget-progress-track ${
                    isOverBudget ? 'budget-progress-track--over' : ''
                  }`}
                  role="progressbar"
                  aria-label="Trip budget used"
                  aria-valuemin={0}
                  aria-valuemax={numericBudget || 1}
                  aria-valuenow={Math.min(tripTotal, numericBudget)}
                >
                  <div
                    className="budget-progress-fill"
                    style={{ width: `${budgetPercentage}%` }}
                  />
                </div>

                <p className="budget-note">
                  {isOverBudget
                    ? `You've exceeded your budget by ₹${formatMoney(
                        tripTotal - numericBudget
                      )}.`
                    : 'Your spending updates automatically when you add, edit, or delete activities.'}
                </p>
              </div>
            )}

            {!hasBudget && (
              <p className="budget-note">
                Add a budget above to see how much money you have left.
              </p>
            )}
          </section>
        )}

        <section className="itinerary-section">
          <div className="itinerary-header">
            <div className="section-eyebrow">
              <span className="eyebrow-icon">📅</span>
              <span>Daily Itinerary</span>
            </div>

            <h2 className="itinerary-title">Explore by Day</h2>

            <p className="itinerary-subtitle">
              Plan activities, organise your schedule, and keep track of costs.
            </p>
          </div>

          {days.length > 0 && (
            <div
              className="day-tabs-wrapper"
              role="tablist"
              aria-label="Trip Days"
            >
              <div className="day-tabs-scroll">
                {days.map((day) => {
                  const isSelected = selectedDayIndex === day.dayIndex;

                  return (
                    <button
                      key={day.dayNumber}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`day-tab ${
                        isSelected ? 'day-tab--active' : ''
                      }`}
                      onClick={() => {
                        setSelectedDayIndex(day.dayIndex);
                        resetActivityForm();
                      }}
                    >
                      <span className="day-tab-number">
                        Day {day.dayNumber}
                      </span>
                      <span className="day-tab-date">{day.shortDate}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="day-panel-card" role="tabpanel">
            <div className="day-panel-header">
              <div className="day-panel-badge">
                <span>Day {activeDay.dayNumber}</span>
              </div>
              <h3 className="day-panel-date">{activeDay.fullDate}</h3>
            </div>

            <section className="activity-form-section">
              <h4 className="activity-section-title">
                {isEditingActivity ? '✏️ Edit Activity' : '＋ Add an Activity'}
              </h4>

              <form
                id="activity-form"
                className="activity-form"
                onSubmit={handleSubmitActivity}
              >
                <div className="activity-form-grid">
                  <label className="activity-field">
                    <span>Activity name *</span>
                    <input
                      type="text"
                      value={activityName}
                      onChange={(event) =>
                        setActivityName(event.target.value)
                      }
                      placeholder="e.g. Visit the beach"
                      maxLength={100}
                      required
                    />
                  </label>

                  <label className="activity-field">
                    <span>Time *</span>
                    <input
                      type="time"
                      value={activityTime}
                      onChange={(event) =>
                        setActivityTime(event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="activity-field">
                    <span>Estimated cost (₹)</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={activityCost}
                      onChange={(event) =>
                        setActivityCost(event.target.value)
                      }
                      placeholder="Optional"
                    />
                  </label>

                  <label className="activity-field activity-field--notes">
                    <span>Notes</span>
                    <textarea
                      value={activityNotes}
                      onChange={(event) =>
                        setActivityNotes(event.target.value)
                      }
                      placeholder="Add any details or reminders..."
                      rows={3}
                      maxLength={500}
                    />
                  </label>
                </div>

                {formError && (
                  <p className="activity-form-error" role="alert">
                    {formError}
                  </p>
                )}

                <div className="activity-form-actions">
                  <button type="submit" className="activity-submit-btn">
                    {isEditingActivity ? 'Save Changes' : 'Add Activity'}
                  </button>

                  {isEditingActivity && (
                    <button
                      type="button"
                      className="activity-cancel-btn"
                      onClick={handleCancelActivityEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="day-activities-section">
              <div className="activities-list-header">
                <h4 className="activity-section-title">
                  Your Schedule ({dayActivities.length})
                </h4>

                {dayActivities.length > 0 && (
                  <p className="activities-total">
                    Day total: ₹{formatMoney(dayTotal)}
                  </p>
                )}
              </div>

              {dayActivities.length > 1 && trip.isUserCreated && (
                <p className="drag-drop-hint">
                  ↕️ Drag the handle on an activity to change its order.
                </p>
              )}

              {dayActivities.length === 0 ? (
                <div className="day-activities-placeholder">
                  <div className="placeholder-icon" aria-hidden="true">
                    🗺️
                  </div>
                  <h4 className="placeholder-title">
                    No activities added for Day {activeDay.dayNumber} yet
                  </h4>
                  <p className="placeholder-text">
                    Add your first activity above. Your schedule, costs, and
                    notes will appear here.
                  </p>
                </div>
              ) : (
                <div className="activities-list">
                  {dayActivities.map((activity) => (
                    <article
                      className={`activity-card ${
                        draggedActivityId === activity.id
                          ? 'activity-card--dragging'
                          : ''
                      } ${
                        dragOverActivityId === activity.id
                          ? 'activity-card--drag-over'
                          : ''
                      }`}
                      key={activity.id}
                      onDragOver={(event) =>
                        handleDragOver(event, activity.id)
                      }
                      onDrop={(event) => handleDrop(event, activity.id)}
                    >
                      {trip.isUserCreated && (
                        <button
                          type="button"
                          className="activity-drag-handle"
                          draggable
                          onDragStart={(event) =>
                            handleDragStart(event, activity.id)
                          }
                          onDragEnd={handleDragEnd}
                          aria-label={`Drag to reorder ${activity.name}`}
                          title="Drag to reorder"
                        >
                          ⠿
                        </button>
                      )}

                      <div className="activity-time">{activity.time}</div>

                      <div className="activity-card-content">
                        <h5 className="activity-card-title">
                          {activity.name}
                        </h5>

                        {activity.notes && (
                          <p className="activity-card-notes">
                            {activity.notes}
                          </p>
                        )}

                        {activity.cost !== '' &&
                          activity.cost !== null &&
                          activity.cost !== undefined && (
                            <p className="activity-card-cost">
                              Estimated cost: ₹{formatMoney(activity.cost)}
                            </p>
                          )}
                      </div>

                      <div className="activity-card-actions">
                        <button
                          type="button"
                          className="activity-edit-btn"
                          onClick={() => handleEditActivity(activity)}
                          aria-label={`Edit ${activity.name}`}
                          title="Edit activity"
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          className="activity-delete-btn"
                          onClick={() => {
                            if (editingActivityId === activity.id) {
                              resetActivityForm();
                            }

                            onDeleteActivity?.(trip.id, activity.id);
                          }}
                          aria-label={`Delete ${activity.name}`}
                          title="Delete activity"
                        >
                          🗑️
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TripDetails;
