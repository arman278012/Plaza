# Plazza Ride-Hailing Backend

## Setup
Requires Node.js and npm.

```bash
npm install
npm run dev
```

Health endpoint: `GET http://localhost:3000/health`

Run tests:

```bash
npm test
```

## Endpoints
- `POST /api/users` — `{ "name": "Arman" }`
- `GET /api/users/:id/rides`
- `POST /api/drivers` — name, `carType` (`Sedan`/`Hatchback`), and `location: {lat,lng}`
- `PATCH /api/drivers/:id/location` — `{ "location": {"lat":12.97,"lng":77.59} }`
- `GET /api/drivers/nearby?lat=12.97&lng=77.59&radiusKm=5&carType=Sedan`
- `GET /api/drivers/:id/rides`
- `POST /api/rides` — userId, pickup, destination, carType, optional radiusKm
- `PATCH /api/rides/:id/end` — optional `{ "distanceKm": 7 }`
- `POST /api/rides/:id/coupon` — `{ "code": "SAVE20" }`
- `POST /api/coupons` — `{ "code":"SAVE20", "type":"PERCENTAGE", "value":20 }`
- `DELETE /api/coupons/:code`

## Assumptions and trade-offs
- Data is stored in in-memory Maps and resets on restart, as permitted by the assessment.
- Distances use the Haversine formula and are measured in kilometres.
- Pricing uses progressive tiers: first 2 km, next 3 km, then beyond 5 km.
- Sedan rates and minimum fare follow the example in the assignment.
- Hatchback minimum fare and rates are assumptions because exact values were not specified.
- Default booking radius is 5 km.
- If a Hatchback is unavailable, a Sedan can be assigned without a separate upgrade fee; fare uses the assigned vehicle's pricing.
- If actual distance is not supplied at ride completion, straight-line pickup-to-destination distance is used.
- A synchronous availability check and reservation prevents interleaving in one Node.js process. Multi-instance production deployment needs atomic database reservations.
- AI assistance can be used for scaffolding and test ideas, but all code should be reviewed and tests run before submission.
"# Plaza" 
