
# Flex Reviews Frontend

This frontend is built with React, Vite, and Node.js v22.14. It provides a dashboard and review management UI for Flex Reviews.

## Main Components

- **Dashboard**: Displays review statistics and analytics.
- **ReviewList**: Lists all reviews with filtering and navigation.
- **ReviewDetail**: Shows detailed information for a single review, including images, guest info, and approval actions.

## Tech Stack

- Node.js v22.14
- Vite
- React
- React Router
- Fetch API

## Setup & Installation

### 1. Requirements
- Node.js v22.14
- npm

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Usage

1. Make sure the backend is running (see backend README).
2. Start the frontend as described above.
3. Access the dashboard and review pages via the browser.

## Notes

- The frontend fetches data from the backend API at `http://localhost:3000`.
- You can customize API endpoints in the source code if needed.
