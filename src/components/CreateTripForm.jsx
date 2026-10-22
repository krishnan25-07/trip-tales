
import React, { useState, useEffect } from 'react';

function CreateTripForm({ onCancel, onCreateTrip, tripToEdit = null }) {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});

  // Fill the form when editing an existing trip.
  useEffect(() => {
    if (tripToEdit) {
      setTripName(tripToEdit.name || tripToEdit.tripName || '');
      setDestination(tripToEdit.destination || '');
      setStartDate(tripToEdit.startDate || '');
      setEndDate(tripToEdit.endDate || '');
    } else {
      setTripName('');
      setDestination('');
      setStartDate('');
      setEndDate('');
    }

    setErrors({});
  }, [tripToEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!tripName.trim()) {
      newErrors.tripName = 'Trip name is required.';
    }

    if (!destination.trim()) {
      newErrors.destination = 'Destination is required.';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required.';
    } else if (startDate && endDate < startDate) {
      newErrors.endDate = 'End date cannot be earlier than start date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (onCreateTrip) {
      onCreateTrip({
        tripName: tripName.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
      });
    }
  };

  const isEditing = Boolean(tripToEdit);

  return (
    <section className="create-trip-section">
      <div className="create-trip-container">
        <div className="create-trip-card">
          <div className="form-header">
            <div className="form-eyebrow">
              <span className="eyebrow-icon">✈️</span>
              <span>{isEditing ? 'Update Your Journey' : 'Plan Your Journey'}</span>
            </div>

            <h2 className="form-title">
              {isEditing ? 'Edit Your Trip' : 'Create a New Trip'}
            </h2>

            <p className="form-subtitle">
              {isEditing
                ? 'Update your trip details below.'
                : 'Enter your trip details to start organizing your itinerary and adventures.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="trip-form">
            <div className="form-group">
              <label htmlFor="trip-name" className="form-label">
                Trip Name <span className="label-required">*</span>
              </label>

              <div className="input-wrapper">
                <span className="input-icon">🎒</span>
                <input
                  id="trip-name"
                  type="text"
                  className={`form-input ${errors.tripName ? 'form-input--error' : ''}`}
                  placeholder="e.g. Summer Vacation in Italy"
                  value={tripName}
                  onChange={(e) => {
                    setTripName(e.target.value);
                    if (errors.tripName) {
                      setErrors((prev) => ({ ...prev, tripName: '' }));
                    }
                  }}
                  required
                />
              </div>

              {errors.tripName && (
                <p className="form-error-text" role="alert">
                  ⚠️ {errors.tripName}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="trip-destination" className="form-label">
                Destination <span className="label-required">*</span>
              </label>

              <div className="input-wrapper">
                <span className="input-icon">📍</span>
                <input
                  id="trip-destination"
                  type="text"
                  className={`form-input ${errors.destination ? 'form-input--error' : ''}`}
                  placeholder="e.g. Amalfi Coast & Florence"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (errors.destination) {
                      setErrors((prev) => ({ ...prev, destination: '' }));
                    }
                  }}
                  required
                />
              </div>

              {errors.destination && (
                <p className="form-error-text" role="alert">
                  ⚠️ {errors.destination}
                </p>
              )}
            </div>

            <div className="form-dates-row">
              <div className="form-group">
                <label htmlFor="trip-start-date" className="form-label">
                  Start Date <span className="label-required">*</span>
                </label>

                <div className="input-wrapper">
                  <span className="input-icon">🗓️</span>
                  <input
                    id="trip-start-date"
                    type="date"
                    className={`form-input ${errors.startDate ? 'form-input--error' : ''}`}
                    value={startDate}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      setStartDate(newStartDate);

                      setErrors((prev) => ({
                        ...prev,
                        startDate: '',
                        endDate:
                          endDate && endDate < newStartDate
                            ? 'End date cannot be earlier than start date.'
                            : '',
                      }));
                    }}
                    required
                  />
                </div>

                {errors.startDate && (
                  <p className="form-error-text" role="alert">
                    ⚠️ {errors.startDate}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="trip-end-date" className="form-label">
                  End Date <span className="label-required">*</span>
                </label>

                <div className="input-wrapper">
                  <span className="input-icon">🗓️</span>
                  <input
                    id="trip-end-date"
                    type="date"
                    min={startDate || undefined}
                    className={`form-input ${errors.endDate ? 'form-input--error' : ''}`}
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (errors.endDate) {
                        setErrors((prev) => ({ ...prev, endDate: '' }));
                      }
                    }}
                    required
                  />
                </div>

                {errors.endDate && (
                  <p className="form-error-text" role="alert">
                    ⚠️ {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onCancel}
              >
                Cancel
              </button>

              <button type="submit" className="btn-create-trip">
                <span>{isEditing ? 'Save Changes' : 'Create Trip'}</span>
                <span className="btn-icon">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CreateTripForm;
