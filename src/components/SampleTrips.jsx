import React from 'react';
import TripCard from './TripCard';

/**
 * Sample trips data (3 predefined sample trips)
 */
const SAMPLE_TRIPS = [
  {
    id: 'kyoto-2026',
    destination: 'Kyoto',
    country: 'Japan',
    dates: 'Apr 12 – Apr 20, 2026',
    badge: 'Cultural Journey',
    duration: '8 Days',
    emoji: '🌸 ⛩️',
    description:
      'Wander through tranquil bamboo groves, historic Shinto shrines, and historic tea houses during cherry blossom season.',
    accentType: 'cherry',
    isUserCreated: false,
  },
  {
    id: 'amalfi-2026',
    destination: 'Amalfi Coast',
    country: 'Italy',
    dates: 'Jun 15 – Jun 23, 2026',
    badge: 'Coastal Escape',
    duration: '9 Days',
    emoji: '🌊 🍋',
    description:
      'Sail along dramatic cliffside shores, explore pastel seaside villages, and savor fresh Mediterranean sunset dining.',
    accentType: 'coastal',
    isUserCreated: false,
  },
  {
    id: 'banff-2026',
    destination: 'Banff National Park',
    country: 'Canada',
    dates: 'Sep 08 – Sep 15, 2026',
    badge: 'Mountain Adventure',
    duration: '7 Days',
    emoji: '🏔️ 🌲',
    description:
      'Hike alongside vivid turquoise glacial lakes, spot alpine wildlife, and unwind by cozy mountain lodges under starry skies.',
    accentType: 'mountain',
    isUserCreated: false,
  },
];

/**
 * SampleTrips Component
 * Displays the trips section:
 * - If user has created trips, displays "Your Planned Trips" group.
 * - Always keeps the 3 sample trip cards visible.
 *
 * @param {Object} props
 * @param {Array} props.userTrips - Array of user-created trip objects
 * @param {Function} [props.onDeleteTrip] - Callback when user deletes a trip
 * @param {Function} [props.onSelectTrip] - Callback when user selects a trip to view details
 */
function SampleTrips({ userTrips = [], onDeleteTrip, onSelectTrip }) {
  const hasUserTrips = userTrips && userTrips.length > 0;

  return (
    <section className="sample-trips-section" id="my-trips">
      <div className="sample-trips-container">
        {/* User-created trips section (visible only when user has created trips) */}
        {hasUserTrips && (
          <div className="user-trips-block">
            <div className="section-header section-header--user">
              <div className="section-eyebrow section-eyebrow--coral">
                <span className="eyebrow-icon">🧳</span>
                <span>My Trips ({userTrips.length})</span>
              </div>
              <h2 className="section-title">Your Planned Trips</h2>
              <p className="section-subtitle">
                Trips you have created. Ready to organize your daily activities and adventures.
              </p>
            </div>

            {/* Grid of user-created trips */}
            <div className="trips-grid user-trips-grid">
              {userTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={onDeleteTrip}
                  onSelectTrip={onSelectTrip}
                />
              ))}
            </div>

            {/* Subtle separator between user trips and sample inspiration */}
            <hr className="trips-section-divider" />
          </div>
        )}

        {/* Existing 3 Sample Trips Block */}
        <div className="sample-trips-block" id="sample-trips">
          <div className="section-header">
            <div className="section-eyebrow">
              <span className="eyebrow-icon">🧭</span>
              <span>Handpicked Itineraries</span>
            </div>
            <h2 className="section-title">
              {hasUserTrips ? 'Sample Journeys for Inspiration' : 'Popular Journeys to Inspire You'}
            </h2>
            <p className="section-subtitle">
              Explore sample trips crafted by wanderers. Start with an existing itinerary
              or design your adventure from scratch.
            </p>
          </div>

          {/* 3 Sample Trip Cards Grid */}
          <div className="trips-grid">
            {SAMPLE_TRIPS.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SampleTrips;
