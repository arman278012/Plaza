
const { randomUUID } = require("crypto");
const { store } = require("../repositories/store");
const { validLocation, distanceKm } = require("../utils/distance");
const { findDriver } = require("./driver-matching.service");
const { calculateFare } = require("./pricing.service");
const { getCoupon, applyCoupon } = require("./coupon.service");

function getSurgeMultiplier() {
  const multiplier = Number(process.env.SURGE_MULTIPLIER || 1);

  if (!Number.isFinite(multiplier) || multiplier < 1) {
    const error = new Error("SURGE_MULTIPLIER must be at least 1");
    error.status = 400;
    error.code = "INVALID_SURGE_MULTIPLIER";
    throw error;
  }

  return multiplier;
}

function createRide({
  userId,
  pickup,
  destination,
  carType = "Sedan",
  radiusKm = 5
}) {
  if (!store.users.has(userId)) {
    const error = new Error("Register the user before booking");
    error.status = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  if (!validLocation(pickup) || !validLocation(destination)) {
    const error = new Error(
      "Valid pickup and destination coordinates are required"
    );
    error.status = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  if (
    !["Sedan", "Hatchback"].includes(carType) ||
    !Number.isFinite(radiusKm) ||
    radiusKm <= 0
  ) {
    const error = new Error(
      "Valid carType and positive radiusKm are required"
    );
    error.status = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const surgeMultiplier = getSurgeMultiplier();

  // Driver selection and reservation remain synchronous.
  // This protects against interleaving within this Node.js process.
  const match = findDriver(pickup, radiusKm, carType);

  if (!match.driver) {
    const error = new Error("No eligible driver found within radius");
    error.status = 409;
    error.code = "NO_DRIVER_AVAILABLE";
    throw error;
  }

  // Reserve the driver before returning the ride.
  match.driver.available = false;

  const ride = {
    id: randomUUID(),
    userId,
    driverId: match.driver.id,
    requestedCarType: carType,
    carType: match.driver.carType,
    upgraded: match.upgraded,
    pickup: { ...pickup },
    destination: { ...destination },
    status: "ONGOING",
    couponCode: null,
    estimatedDistanceKm: distanceKm(pickup, destination),
    surgeMultiplier,
    fare: null,
    cancellationFee: 0,
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  store.rides.set(ride.id, ride);

  return ride;
}

function endRide(rideId, requestedDistance) {
  const ride = store.rides.get(rideId);

  if (!ride) {
    const error = new Error("Ride not found");
    error.status = 404;
    error.code = "RIDE_NOT_FOUND";
    throw error;
  }

  if (ride.status !== "ONGOING") {
    const error = new Error("Only ongoing rides can be ended");
    error.status = 409;
    error.code = "INVALID_RIDE_STATE";
    throw error;
  }

  const distance =
    requestedDistance === undefined
      ? ride.estimatedDistanceKm
      : Number(requestedDistance);

  if (!Number.isFinite(distance) || distance <= 0) {
    const error = new Error("distanceKm must be a positive number");
    error.status = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  let fare = calculateFare(
    distance,
    ride.carType,
    ride.surgeMultiplier || 1
  );

  if (ride.couponCode) {
    fare = applyCoupon(fare, getCoupon(ride.couponCode));
  }

  ride.status = "COMPLETED";
  ride.actualDistanceKm = distance;
  ride.fare = fare;
  ride.completedAt = new Date().toISOString();

  const driver = store.drivers.get(ride.driverId);

  if (driver) {
    driver.available = true;
  }

  return ride;
}

function applyRideCoupon(rideId, code) {
  const ride = store.rides.get(rideId);

  if (!ride) {
    const error = new Error("Ride not found");
    error.status = 404;
    error.code = "RIDE_NOT_FOUND";
    throw error;
  }

  if (ride.status !== "ONGOING") {
    const error = new Error(
      "Coupon can only be applied to an ongoing ride"
    );
    error.status = 409;
    error.code = "INVALID_RIDE_STATE";
    throw error;
  }

  const coupon = getCoupon(code);

  // Validate against the estimated fare, including surge.
  applyCoupon(
    calculateFare(
      ride.estimatedDistanceKm,
      ride.carType,
      ride.surgeMultiplier || 1
    ),
    coupon
  );

  ride.couponCode = coupon.code;

  return ride;
}

function cancelRide(rideId) {
  const ride = store.rides.get(rideId);

  if (!ride) {
    const error = new Error("Ride not found");
    error.status = 404;
    error.code = "RIDE_NOT_FOUND";
    throw error;
  }

  if (ride.status !== "ONGOING") {
    const error = new Error("Only ongoing rides can be cancelled");
    error.status = 409;
    error.code = "INVALID_RIDE_STATE";
    throw error;
  }

  const cancellationFee = Number(
    process.env.CANCELLATION_FEE || 20
  );

  if (!Number.isFinite(cancellationFee) || cancellationFee < 0) {
    const error = new Error(
      "CANCELLATION_FEE must be a non-negative number"
    );
    error.status = 400;
    error.code = "INVALID_CANCELLATION_FEE";
    throw error;
  }

  ride.status = "CANCELLED";
  ride.cancellationFee = cancellationFee;
  ride.cancelledAt = new Date().toISOString();

  const driver = store.drivers.get(ride.driverId);

  if (driver) {
    driver.available = true;
  }

  return ride;
}

function getUserRides(userId) {
  return [...store.rides.values()].filter(
    (ride) => ride.userId === userId
  );
}

function getDriverRides(driverId) {
  return [...store.rides.values()].filter(
    (ride) => ride.driverId === driverId
  );
}

module.exports = {
  createRide,
  endRide,
  applyRideCoupon,
  cancelRide,
  getUserRides,
  getDriverRides
};
