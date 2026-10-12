# Plazza Ride-Hailing Backend

A modular REST API built with **Node.js and Express.js** for user and driver management, ride booking, distance-based fare calculation, and coupon discounts.

## Setup

**Requirements:** Node.js and npm

```bash
npm install
npm run dev
```

**Base URL:** `http://localhost:3000`  
**Health Check:** `GET /health`

Run automated tests:

```bash
npm test
```

## Features

- User and driver registration with location management.
- Nearby driver discovery using the Haversine formula.
- Ride booking, completion, cancellation, and ride history.
- Progressive distance-based pricing with vehicle-specific minimum fares.
- Sedan and Hatchback support, including free Hatchback-to-Sedan upgrades.
- Coupon creation, validation, application, and deletion.
- Driver availability management and structured error responses.

## Bonus Features

- **Surge Pricing:** Configurable fare multiplier applied during fare calculation.
- **Configurable Driver Matching:** Supports `nearest` and `highest-rated` strategies.
- **Ride Cancellation:** Cancels ongoing rides, records a configurable cancellation fee, and releases the assigned driver.
- **Driver Reservation Safety:** Synchronous availability checks and reservation prevent duplicate assignments within a single Node.js process.

## API Endpoints

| Method | Endpoint                    | Description                   |
| ------ | --------------------------- | ----------------------------- |
| GET    | `/health`                   | Health check                  |
| POST   | `/api/users`                | Register a user               |
| GET    | `/api/users/:id/rides`      | Get user ride history         |
| POST   | `/api/drivers`              | Register a driver             |
| PATCH  | `/api/drivers/:id/location` | Update driver location        |
| GET    | `/api/drivers/nearby`       | Find nearby available drivers |
| GET    | `/api/drivers/:id/rides`    | Get driver ride history       |
| POST   | `/api/rides`                | Book a ride                   |
| PATCH  | `/api/rides/:id/end`        | Complete a ride               |
| PATCH  | `/api/rides/:id/cancel`     | Cancel an ongoing ride        |
| POST   | `/api/rides/:id/coupon`     | Apply a coupon to a ride      |
| POST   | `/api/coupons`              | Create a coupon               |
| DELETE | `/api/coupons/:code`        | Delete a coupon               |

### Example Request Bodies

**Register a user — `POST /api/users`**

```json
{
  "name": "Arman"
}
```

**Register a driver — `POST /api/drivers`**

```json
{
  "name": "Sedan Driver",
  "carType": "Sedan",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "rating": 4.5
}
```

**Book a ride — `POST /api/rides`**

```json
{
  "userId": "USER_ID",
  "pickup": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "destination": {
    "lat": 12.98,
    "lng": 77.6
  },
  "carType": "Sedan",
  "radiusKm": 5
}
```

**Complete a ride — `PATCH /api/rides/:id/end`**

```json
{
  "distanceKm": 7
}
```

**Apply a coupon — `POST /api/rides/:id/coupon`**

```json
{
  "code": "SAVE20"
}
```

**Create a coupon — `POST /api/coupons`**

```json
{
  "code": "SAVE20",
  "type": "PERCENTAGE",
  "value": 20
}
```

For nearby drivers, use query parameters such as `lat`, `lng`, `radiusKm`, and `carType`.

## Environment Configuration

Create a `.env` file in the project root:

```env
PORT=3000
DRIVER_MATCHING_STRATEGY=nearest
SURGE_MULTIPLIER=1
CANCELLATION_FEE=20
```

| Variable                   | Description                         |
| -------------------------- | ----------------------------------- |
| `PORT`                     | Server port; defaults to `3000`     |
| `DRIVER_MATCHING_STRATEGY` | `nearest` or `highest-rated`        |
| `SURGE_MULTIPLIER`         | Fare multiplier; `1` means no surge |
| `CANCELLATION_FEE`         | Fee for cancelling an ongoing ride  |

Keep `.env` out of version control. Commit an `.env.example` containing safe defaults if needed.

## Pricing & Business Rules

- Progressive pricing tiers: first 2 km, next 3 km, and distance beyond 5 km.
- Vehicle-specific minimum fares and rates apply.
- If no eligible Hatchback is available, an eligible Sedan may be assigned without a separate upgrade fee.
- The assigned vehicle's pricing applies to the ride.
- The actual trip distance can be supplied at completion; otherwise, pickup-to-destination Haversine distance is used.
- Completing or cancelling a ride releases the assigned driver.

## Assumptions & Trade-offs

- Data is stored in **in-memory Maps** and resets when the server restarts.
- The default driver search radius is 5 km.
- Hatchback pricing uses assumed values where the assignment does not specify exact rates.
- Synchronous driver reservation protects against duplicate assignment within one Node.js process. Multi-instance deployments require atomic reservations using shared storage.
- Automated tests currently pass for the existing API and pricing test suites. Bonus scenarios should be covered by dedicated tests before claiming complete bonus test coverage.

## Tech Stack

**Node.js · Express.js · JavaScript · Jest · Supertest**
