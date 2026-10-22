
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SampleTrips from './components/SampleTrips';
import CreateTripForm from './components/CreateTripForm';
import TripDetails from './components/TripDetails';
import Footer from './components/Footer';
import './App.css';

const STORAGE_KEY = 'triptales_saved_trips';

function getSavedTrips() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed.map((trip) => ({
          ...trip,
          budget:
            trip.budget === '' ||
            trip.budget === null ||
            trip.budget === undefined
              ? null
              : Number.isFinite(Number(trip.budget)) &&
                  Number(trip.budget) >= 0
                ? Number(trip.budget)
                : null,
          activities: Array.isArray(trip.activities)
            ? trip.activities
            : [],
        }));
      }
    }
  } catch (error) {
    console.error('Failed to load trips from localStorage:', error);
  }

  return [];
}

function formatDate(dateStr) {
  if (!dateStr) return '';

  const [year, month, day] = dateStr.split('-');

  if (!year || !month || !day) return dateStr;

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const monthName = monthNames[parseInt(month, 10) - 1] || month;

  return `${monthName} ${parseInt(day, 10)}, ${year}`;
}

function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return 'Planned Trip';

  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);

  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);

  const diffDays =
    Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return diffDays > 0
    ? `${diffDays} Day${diffDays > 1 ? 's' : ''}`
    : '1 Day';
}

function App() {
  const [isCreatingTrip, setIsCreatingTrip] = useState(
    () => Boolean(window.history.state?.formOpen)
  );

  const [editingTripId, setEditingTripId] = useState(null);

  const [selectedTripId, setSelectedTripId] = useState(
    () => window.history.state?.selectedTripId || null
  );

  const [userTrips, setUserTrips] = useState(getSavedTrips);

  useEffect(() => {
    const handlePopState = (event) => {
      setIsCreatingTrip(Boolean(event.state?.formOpen));
      setSelectedTripId(event.state?.selectedTripId || null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Budgets and activity order are stored with each trip.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userTrips));
    } catch (error) {
      console.error('Failed to save trips to localStorage:', error);
    }
  }, [userTrips]);

  const handleOpenPlanTrip = () => {
    if (selectedTripId) {
      setSelectedTripId(null);
    }

    if (!isCreatingTrip) {
      window.history.pushState({ formOpen: true }, '');
      setIsCreatingTrip(true);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTrip = (tripId) => {
    window.history.pushState({ selectedTripId: tripId }, '');
    setSelectedTripId(tripId);
    setIsCreatingTrip(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditTrip = (tripId) => {
    setEditingTripId(tripId);
    setSelectedTripId(null);
    setIsCreatingTrip(true);

    window.history.pushState({ formOpen: true }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsCreatingTrip(false);
    setSelectedTripId(editingTripId);
    setEditingTripId(null);

    window.history.replaceState(
      { selectedTripId: editingTripId },
      ''
    );

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToTrips = () => {
    if (window.history.state?.selectedTripId) {
      window.history.back();
    }

    setSelectedTripId(null);

    setTimeout(() => {
      const section = document.getElementById('my-trips');

      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  const handleReturnHome = () => {
    if (
      window.history.state?.formOpen ||
      window.history.state?.selectedTripId
    ) {
      window.history.back();
    }

    setIsCreatingTrip(false);
    setSelectedTripId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTrips = () => {
    if (
      window.history.state?.formOpen ||
      window.history.state?.selectedTripId
    ) {
      window.history.back();
    }

    setIsCreatingTrip(false);
    setSelectedTripId(null);

    setTimeout(() => {
      const section = document.getElementById('my-trips');

      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  const handleCreateTrip = (tripData) => {
    if (editingTripId) {
      const { tripName, destination, startDate, endDate } = tripData;

      setUserTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === editingTripId
            ? {
                ...trip,
                name: tripName,
                tripName,
                destination,
                startDate,
                endDate,
                dates: `${formatDate(startDate)} – ${formatDate(endDate)}`,
                duration: calculateDuration(startDate, endDate),
              }
            : trip
        )
      );

      window.history.replaceState({}, '');
      setSelectedTripId(null);
      setIsCreatingTrip(false);
      setEditingTripId(null);

      setTimeout(() => {
        const section = document.getElementById('my-trips');

        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return;
    }

    const { tripName, destination, startDate, endDate } = tripData;

    const newTrip = {
      id: `trip-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      name: tripName,
      tripName,
      destination,
      startDate,
      endDate,
      dates: `${formatDate(startDate)} – ${formatDate(endDate)}`,
      duration: calculateDuration(startDate, endDate),
      badge: 'My Trip',
      emoji: '✈️ 🗺️',
      accentType: 'user',
      isUserCreated: true,
      budget: null,
      activities: [],
    };

    setUserTrips((prevTrips) => [newTrip, ...prevTrips]);

    if (window.history.state?.formOpen) {
      window.history.back();
    }

    setIsCreatingTrip(false);

    setTimeout(() => {
      const section = document.getElementById('my-trips');

      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDeleteTrip = (tripIdToDelete) => {
    setUserTrips((prevTrips) =>
      prevTrips.filter((trip) => trip.id !== tripIdToDelete)
    );

    if (selectedTripId === tripIdToDelete) {
      setSelectedTripId(null);
    }
  };

  const handleAddActivity = (tripId, activityData) => {
    const { name, time, cost, notes = '', date } = activityData;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof time !== 'string' ||
      !time ||
      typeof date !== 'string' ||
      !date
    ) {
      return false;
    }

    const numericCost =
      cost === '' || cost === null || cost === undefined
        ? null
        : Number(cost);

    if (
      numericCost !== null &&
      (!Number.isFinite(numericCost) || numericCost < 0)
    ) {
      return false;
    }

    const targetTrip = userTrips.find(
      (trip) => trip.id === tripId && trip.isUserCreated === true
    );

    if (
      !targetTrip ||
      !targetTrip.startDate ||
      !targetTrip.endDate ||
      date < targetTrip.startDate ||
      date > targetTrip.endDate
    ) {
      return false;
    }

    const newActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      name: name.trim(),
      time,
      cost: numericCost,
      notes: typeof notes === 'string' ? notes.trim() : '',
      date,
    };

    setUserTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId && trip.isUserCreated === true
          ? {
              ...trip,
              activities: [
                ...(Array.isArray(trip.activities) ? trip.activities : []),
                newActivity,
              ],
            }
          : trip
      )
    );

    return true;
  };

  const handleUpdateActivity = (tripId, activityId, activityData) => {
    const { name, time, cost, notes = '' } = activityData;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof time !== 'string' ||
      !time
    ) {
      return false;
    }

    const numericCost =
      cost === '' || cost === null || cost === undefined
        ? null
        : Number(cost);

    if (
      numericCost !== null &&
      (!Number.isFinite(numericCost) || numericCost < 0)
    ) {
      return false;
    }

    const targetTrip = userTrips.find(
      (trip) => trip.id === tripId && trip.isUserCreated === true
    );

    if (
      !targetTrip ||
      !Array.isArray(targetTrip.activities) ||
      !targetTrip.activities.some((activity) => activity.id === activityId)
    ) {
      return false;
    }

    setUserTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId && trip.isUserCreated === true
          ? {
              ...trip,
              activities: (trip.activities || []).map((activity) =>
                activity.id === activityId
                  ? {
                      ...activity,
                      name: name.trim(),
                      time,
                      cost: numericCost,
                      notes: typeof notes === 'string' ? notes.trim() : '',
                    }
                  : activity
              ),
            }
          : trip
      )
    );

    return true;
  };

  const handleDeleteActivity = (tripId, activityId) => {
    setUserTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId && trip.isUserCreated === true
          ? {
              ...trip,
              activities: (trip.activities || []).filter(
                (activity) => activity.id !== activityId
              ),
            }
          : trip
      )
    );
  };

  const handleSaveTripBudget = (tripId, budgetValue) => {
    const budget =
      budgetValue === '' || budgetValue === null
        ? null
        : Number(budgetValue);

    if (
      budget !== null &&
      (!Number.isFinite(budget) || budget < 0)
    ) {
      return false;
    }

    const targetTrip = userTrips.find(
      (trip) => trip.id === tripId && trip.isUserCreated === true
    );

    if (!targetTrip) return false;

    setUserTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId && trip.isUserCreated === true
          ? { ...trip, budget }
          : trip
      )
    );

    return true;
  };

  // Reorder only the selected day's activities, keeping other days untouched.
  const handleReorderActivities = (tripId, date, orderedIds) => {
    const targetTrip = userTrips.find(
      (trip) => trip.id === tripId && trip.isUserCreated === true
    );

    if (!targetTrip || !Array.isArray(orderedIds)) return false;

    const allActivities = Array.isArray(targetTrip.activities)
      ? targetTrip.activities
      : [];

    const currentDayActivities = allActivities.filter(
      (activity) => activity.date === date
    );

    if (
      currentDayActivities.length !== orderedIds.length ||
      new Set(orderedIds).size !== orderedIds.length ||
      !orderedIds.every((id) =>
        currentDayActivities.some((activity) => activity.id === id)
      )
    ) {
      return false;
    }

    const orderedActivities = orderedIds.map((id) =>
      currentDayActivities.find((activity) => activity.id === id)
    );

    let nextDayIndex = 0;

    const reorderedActivities = allActivities.map((activity) => {
      if (activity.date !== date) return activity;

      const reorderedActivity = orderedActivities[nextDayIndex];
      nextDayIndex += 1;

      return reorderedActivity;
    });

    setUserTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId && trip.isUserCreated === true
          ? { ...trip, activities: reorderedActivities }
          : trip
      )
    );

    return true;
  };

  const activeSelectedTrip =
    userTrips.find((trip) => trip.id === selectedTripId) || null;

  const activeEditingTrip =
    userTrips.find((trip) => trip.id === editingTripId) || null;

  return (
    <div className="app-layout">
      <Navbar
        onNavigateHome={handleReturnHome}
        onNavigateTrips={handleNavigateToTrips}
      />

      <main className="main-content">
        {isCreatingTrip ? (
          <CreateTripForm
            key={editingTripId || 'new-trip'}
            tripToEdit={activeEditingTrip}
            onCancel={editingTripId ? handleCancelEdit : handleReturnHome}
            onCreateTrip={handleCreateTrip}
          />
        ) : activeSelectedTrip ? (
          <TripDetails
            key={activeSelectedTrip.id}
            trip={activeSelectedTrip}
            onBack={handleBackToTrips}
            onEditTrip={handleEditTrip}
            onAddActivity={handleAddActivity}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
            onSaveTripBudget={handleSaveTripBudget}
            onReorderActivities={handleReorderActivities}
          />
        ) : (
          <>
            <Hero onPlanTrip={handleOpenPlanTrip} />

            <SampleTrips
              userTrips={userTrips}
              onDeleteTrip={handleDeleteTrip}
              onSelectTrip={handleSelectTrip}
            />
          </>
        )}
      </main>

      <Footer
        onPlanTrip={handleOpenPlanTrip}
        onNavigateTrips={handleNavigateToTrips}
      />
    </div>
  );
}

export default App;
