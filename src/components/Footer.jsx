import React from 'react';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer Component
 * A clean, minimalist travel footer concluding the homepage.
 *
 * @param {Object} props
 * @param {Function} props.onPlanTrip - Callback to open the trip creation form
 * @param {Function} props.onNavigateTrips - Callback to scroll or navigate to trips section
 */
function Footer({ onPlanTrip, onNavigateTrips }) {
  const handleTripsClick = (e) => {
    e.preventDefault();
    if (onNavigateTrips) {
      onNavigateTrips();
    } else {
      const el = document.getElementById('my-trips');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">✈️</span>
            <span className="footer-logo-text">
              Trip<span className="brand-name-accent">Tales</span>
            </span>
          </div>
          <p className="footer-tagline">
            Your interactive trip planner for unforgettable adventures.
          </p>
        </div>

        <div className="footer-links">
          <a
            href="#sample-trips"
            className="footer-link"
            onClick={handleTripsClick}
          >
            Sample Trips
          </a>
          <span className="footer-link-dot">•</span>
          <a
            href="#my-trips"
            className="footer-link"
            onClick={handleTripsClick}
          >
            My Trips
          </a>
          <span className="footer-link-dot">•</span>
          <a
            href="#plan-trip"
            className="footer-link"
            onClick={(e) => {
              if (onPlanTrip) {
                e.preventDefault();
                onPlanTrip();
              }
            }}
          >
            Plan a Trip
          </a>
        </div>

        <div className="footer-bottom">
          <p>© {CURRENT_YEAR} TripTales. Crafted for passionate wanderers.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
