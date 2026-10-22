import React from 'react';

/**
 * TripCard Component
 * Displays a single trip card. Works for both user-created trips and sample trips.
 * Displays trip name, destination, start date, end date, theme emoji, category badge,
 * and duration.
 *
 * @param {Object} props
 * @param {Object} props.trip - Trip information object
 * @param {Function} [props.onDelete] - Callback to delete a user-created trip
 * @param {Function} [props.onSelectTrip] - Callback when user clicks View Details on their trip
 */
function TripCard({ trip, onDelete, onSelectTrip }) {
  const {
    name,
    destination,
    country,
    dates,
    startDate,
    endDate,
    badge,
    duration,
    emoji,
    description,
    accentType = 'cherry',
    isUserCreated,
  } = trip;

  // Format the date string for display (shows both start and end date)
  const displayDates = dates || (startDate && endDate ? `${startDate} – ${endDate}` : 'Dates not set');

  return (
    <article className={`trip-card trip-card--${accentType} ${isUserCreated ? 'trip-card--user' : ''}`}>
      {/* Visual scenic header with themed emojis & category pill */}
      <div className="trip-card-banner">
        <div className="trip-emoji-cluster" aria-hidden="true">
          <span className="trip-main-emoji">{emoji || '✈️'}</span>
        </div>
        <span className="trip-badge">{badge || (isUserCreated ? 'My Trip' : 'Featured')}</span>
      </div>

      {/* Card Content Body */}
      <div className="trip-card-content">
        {/* Destination & Country OR Trip Name & Destination */}
        <div className="trip-location-group">
          {isUserCreated ? (
            <>
              <h3 className="trip-destination">{name || trip.tripName}</h3>
              <span className="trip-country trip-country--user">📍 {destination}</span>
            </>
          ) : (
            <>
              <h3 className="trip-destination">{destination}</h3>
              <span className="trip-country">{country}</span>
            </>
          )}
        </div>

        {/* Dates Row (Start Date & End Date) */}
        <div className="trip-date-row">
          <svg
            className="trip-date-icon"
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
          <span className="trip-dates">{displayDates}</span>
        </div>

        {/* Short description */}
        {description ? (
          <p className="trip-description">{description}</p>
        ) : (
          <p className="trip-description trip-description--user">
            Custom trip to {destination}. Ready for your itinerary planning!
          </p>
        )}

        {/* Card Footer with Duration, Delete action, and explore link */}
        <div className="trip-card-footer">
          <span className="trip-duration-pill">
            <svg
              className="duration-icon"
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
            {duration || 'Planned'}
          </span>

          <div className="trip-card-actions">
            {/* Delete button: only for user-created trips */}
            {isUserCreated && onDelete && (
              <button
                type="button"
                className="btn-delete-trip"
                onClick={() => onDelete(trip.id)}
                title="Delete this trip"
                aria-label={`Delete ${name || trip.tripName || 'trip'}`}
              >
                <svg
                  className="delete-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span>Delete</span>
              </button>
            )}

            {/* View Details: clickable for user-created trips, display-only for sample trips */}
            {isUserCreated && onSelectTrip ? (
              <button
                type="button"
                className="trip-explore-btn"
                onClick={() => onSelectTrip(trip.id)}
                aria-label={`View details for ${name || trip.tripName || 'trip'}`}
              >
                <span>View Details</span>
                <span className="explore-arrow">→</span>
              </button>
            ) : (
              <span className="trip-explore-text">
                View Details
                <span className="explore-arrow">→</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default TripCard;
