# Plazza Ride-Hailing Backend

A modular REST API built with **Node.js and Express.js** for driver management, ride booking, fare calculation, and coupon-based discounts.

## Setup

**Requirements:** Node.js and npm

```bash
npm install
npm run dev
```

**Base URL:** `http://localhost:3000`  
**Health Check:** `GET /health`

**Run Tests:**

```bash
npm test
```

## Features

- User and driver registration with location management.
- Nearby driver discovery using Haversine distance.
- Ride booking, completion, and ride history.
- Progressive distance-based pricing with minimum fares.
- Sedan and Hatchback support with free Hatchback-to-Sedan upgrades.
- Percentage-based coupons and discount validation.
- Driver availability management and appropriate error handling.

### Bonus Features

- **Surge Pricing:** Configurable fare multiplier applied during fare calculation.
- **Driver Matching Strategy:** Supports `nearest` and `highest-rated` driver selection.
- **Ride Cancellation:** Cancel ongoing rides with a configurable cancellation fee.
- **Concurrency Safety:** Synchronous driver reservation prevents duplicate assignments within a single Node.js process.

## API Endpoints

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/users`                | Register user          |
| GET    | `/api/users/:id/rides`      | User ride history      |
| POST   | `/api/drivers`              | Register driver        |
| PATCH  | `/api/drivers/:id/location` | Update driver location |
| GET    | `/api/drivers/nearby`       | Find nearby drivers    |
| GET    | `/api/drivers/:id/rides`    | Driver ride history    |
| POST   | `/api/rides`                | Book a ride            |
| PATCH  | `/api/rides/:id/end`        | Complete ride          |
| PATCH  | `/api/rides/:id/cancel`     | Cancel ride            |
| POST   | `/api/rides/:id/coupon`     | Apply coupon           |
| POST   | `/api/coupons`              | Create coupon          |
| DELETE | `/api/coupons/:code`        | Delete coupon          |

## Environment Configuration

Create a `.env` file in the project root:

```env
PORT=3000
DRIVER_MATCHING_STRATEGY=nearest
SURGE_MULTIPLIER=1
CANCELLATION_FEE=20
```

- `DRIVER_MATCHING_STRATEGY`: `nearest` or `highest-rated`
- `SURGE_MULTIPLIER`: `1` disables surge pricing; values above `1` increase fares.
- `CANCELLATION_FEE`: Fee charged for cancelling an ongoing ride.

## Pricing & Business Rules

- Distance-based progressive pricing: **0–2 km, 2–5 km, and above 5 km**.
- Minimum fares apply based on vehicle type.
- Hatchback requests can be upgraded to Sedan when no eligible Hatchback is available.
- The assigned vehicle's pricing applies after an upgrade.
- Completed rides release drivers for future bookings.
- Cancelled rides release drivers and record the cancellation fee.
- When actual trip distance is unavailable, Haversine distance between pickup and destination is used.

## Assumptions & Trade-offs

- Data is stored in **in-memory Maps** and resets when the server restarts.
- Default driver search radius is **5 km**.
- Hatchback pricing is assumed where the assignment does not specify exact rates.
- Driver reservation is safe against synchronous conflicts in a single Node.js process. Multi-instance deployments require atomic database operations.
- Automated tests cover core API and pricing functionality; bonus scenarios should also be verified before submission.

## Tech Stack

**Node.js · Express.js · JavaScript · Jest · Supertest**
