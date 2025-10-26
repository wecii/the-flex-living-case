# Flex Reviews Backend API

This backend application provides 5 main endpoints. For proper integration and data flow, please follow the sequence below:

## Setup and Run

This backend runs on Node.js (v22.14 recommended) and SQLite. Follow the steps below to get the project up and running:

### 1. Requirements
- Node.js (v22.14 recommended)

### 2. Install dependencies

```bash
git clone ... && cd ...
npm install
```

### 3. Create SQLite Database

The database file and tables will be created automatically. It deletes db file on every SIGTERM or EXIT

### 4. Start the server

```bash
npm run dev
```

### 5. API Endpoints
- `GET /api/integration/hostaway` : Import and normalize reviews from Hostaway (reads mock data and saves to DB)
- `GET /api/reviews` : List all reviews
- `GET /api/reviews/:id` : Get a specific review
- `POST /api/reviews/:id/approve` : Approve a review
- `GET /api/dashboard/stats` : Dashboard statistics

### 6. Environment Variables
If needed, you can change the database path in .env

## Notes
- By default, the SQLite file is created in the backend folder.
- API runs on localhost:3000.
- This API is a very simple version. There's no property table or properties stored in the database. If desired, foreign keys can be extracted from the review table and combined with other tables, but for simplicity's sake, a single table is the target.

## 1. Hostaway Integration Endpoint

**Purpose:** Fetches review data from Hostaway API or mock data, normalizes it, and saves it in bulk to the database.

- **Endpoint:** `POST /api/integration/hostaway`
- **Usage:** This endpoint should be called first. It ensures the system has up-to-date and normalized review data.
- **Note:** If you skip this step, other endpoints may not return any data.

## 2. Review Listing Endpoint

**Purpose:** Lists review records from the database with filtering options.

- **Endpoint:** `GET /api/reviews`
- **Usage:** After Hostaway integration, use this endpoint to list reviews. You can filter by property_name, status, source, date range, etc.

## 3. Get a Specific Review

**Purpose:** Show details of a review

- **Endpoint:** `GET /api/reviews/:id`
- **Usage:** After Hostaway integration, use this endpoint to get review details.

## 4. Review Approve Endpoint

**Purpose:** Approves a review and updates its status.

- **Endpoint:** `POST /api/reviews/:id/approve`
- **Usage:** Call this endpoint for the review you want to approve. The review status will be updated to 'approved'.

## 5. Dashboard statistics

**Purpose:** Show stats of reviews

- **Endpoint:** `GET /api/dashboard/stats`
- **Usage:** On page dashboard load it calls automatically.

---

**Sequence Logic:**
1. First, fetch and save data via Hostaway integration.
2. Then, list reviews.
3. Finally, approve reviews as needed.

Following this sequence is required for the system to work correctly and consistently. For more details and examples, please check the code.
