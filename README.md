
# Trip Tales ✈️

A travel planning application built with **React** and **Vite**. Organize your trips, manage daily activities, and track your travel budget in one place!

<p align="center">
  <a href="https://trip-tales-planner.netlify.app/">
    <strong>🌍 Explore the Live Demo</strong>
  </a>
</p>

## ✨ Overview

**Trip Tales** is a browser-based travel planner that helps users organize trip details, plan daily itineraries, manage activities, and keep track of travel expenses.

The application includes an interactive activity planner, a trip budget tracker, and drag-and-drop activity reordering. It demonstrates React component design, state management, event handling, browser storage, and responsive web development.

## 🚀 Features

- **Trip management:** Create and manage travel plans.
- **Daily itineraries:** Organize activities by travel day.
- **Activity management:** Add, edit, and delete planned activities.
- **Activity details:** Keep track of activity information, times, notes, and costs.
- **Trip budget tracker:** Set a budget for a trip.
- **Expense tracking:** Calculate total activity expenses.
- **Budget overview:** View the total spent, remaining budget, or overspending status.
- **Drag-and-drop reordering:** Rearrange activities within the same day.
- **Persistent trip data:** Save trip information in browser `localStorage`.
- **Responsive interface:** Use the application on desktop and mobile screens.

## 🛠️ Technologies Used

- **React** — Reusable UI components and state management.
- **Vite** — Development server and production build.
- **JavaScript (ES modules)** — Application logic and interactions.
- **HTML5** — Page structure.
- **CSS3** — Styling and responsive layouts.
- **Browser APIs** — `localStorage` for client-side data persistence.
- **Git & GitHub** — Version control and source code hosting.
- **Netlify** — Application deployment and hosting.

## 🧳 How to Use

1. Open the [Trip Tales live demo](https://trip-tales-planner.netlify.app/).
2. Create a trip and enter its details.
3. Organize your itinerary by travel day.
4. Add activities and enter their relevant details, including costs.
5. Set a budget to monitor your trip expenses.
6. Edit or delete activities as your plans change.
7. Drag and drop activities to rearrange their order within a day.
8. Refresh the page to check that your saved trip data persists.

## 💻 Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (a version compatible with your installed Vite release).
- npm, which comes with Node.js.
- Git, to clone the repository.

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Code Quality

Run the linter:

```bash
npm run lint
```

*Note: The lint command works if it is configured in `package.json`.*

## 📁 Project Structure

```text
trip-tales/
├── public/
│   |─ favicon.svg
├── src/
│   ├── components/
│   │   └── TripDetails.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

## 🔗 Links

- **Live Demo:** [https://trip-tales-planner.netlify.app/](https://trip-tales-planner.netlify.app/)
- **GitHub Repository:** [https://github.com/krishnan25-07/trip-tales](https://github.com/krishnan25-07/trip-tales)

## 🌱 Future Improvements

- Move activities between different travel days using drag-and-drop.
- Add expense breakdowns by category.
- Export trip itineraries and expenses as PDF files.
- Introduce cloud storage and user accounts.
- Add trip-sharing functionality.

## 👩‍💻 Author

Created by **Archana Krishna** as a front-end development project to practise React, JavaScript, state management, data persistence, and responsive UI development.

---

If you enjoy the project, consider giving the repository a ⭐ on GitHub!
