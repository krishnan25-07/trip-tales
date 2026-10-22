import React from 'react';

/**
 * Hero Component
 * Welcomes the user with a travel-themed intro, the main heading,
 * and a prominent call-to-action button to plan a trip.
 */
function Hero({ onPlanTrip }) {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Subtle pill badge at the top */}
        <div className="hero-badge">
          <span className="badge-sparkle">✈️</span>
          <span>Effortless Travel Itineraries</span>
        </div>

        {/* Main Heading as requested */}
        <h1 className="hero-heading">
          Your next adventure <span className="hero-heading-highlight">starts here.</span>
        </h1>

        {/* Short, inspiring travel description */}
        <p className="hero-description">
          Map out daily destinations, curate must-see landmarks, and keep all your
          travel inspiration neatly organized in one delightful place.
        </p>

        {/* Prominent Call to Action */}
        <div className="hero-actions">
          <button
            type="button"
            className="btn-plan-trip"
            id="plan-trip-button"
            onClick={onPlanTrip}
          >
            <span>Plan a Trip</span>
            <svg
              className="btn-arrow-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Small travel feature highlights */}
        <div className="hero-features-ribbon">
          <div className="feature-item">
            <span className="feature-icon">🗺️</span>
            <span>Visual Itineraries</span>
          </div>
          <div className="feature-divider" />
          <div className="feature-item">
            <span className="feature-icon">📍</span>
            <span>Curated Stops</span>
          </div>
          <div className="feature-divider" />
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <span>Simple & Flexible</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
