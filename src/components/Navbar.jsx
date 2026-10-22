import React from 'react';

/**
 * Navbar Component
 * Displays the TripTales branding with a travel-themed logo and the "My Trips" link.
 *
 * @param {Object} props
 * @param {Function} props.onNavigateHome - Callback to return to the homepage view
 * @param {Function} props.onNavigateTrips - Callback to scroll or navigate to the trips section
 */
function Navbar({ onNavigateHome, onNavigateTrips }) {
  const handleMyTripsClick = (e) => {
    e.preventDefault();
    if (onNavigateTrips) {
      onNavigateTrips();
    } else {
      const section = document.getElementById('my-trips');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        {/* TripTales Brand Logo */}
        <a
          href="#"
          className="navbar-brand"
          aria-label="TripTales Homepage"
          onClick={(e) => {
            if (onNavigateHome) {
              e.preventDefault();
              onNavigateHome();
            }
          }}
        >
          <div className="brand-icon-box">
            {/* Travel Compass / Paper Plane Icon */}
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.25" />
            </svg>
          </div>
          <div className="brand-text-group">
            <span className="brand-name">
              Trip<span className="brand-name-accent">Tales</span>
            </span>
            <span className="brand-tagline">Trip Planner</span>
          </div>
        </a>

        {/* Navigation Links */}
        <div className="navbar-nav">
          <a
            href="#my-trips"
            className="nav-link"
            onClick={handleMyTripsClick}
          >
            <svg
              className="nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>My Trips</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
