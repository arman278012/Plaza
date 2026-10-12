
const { store } = require("../repositories/store");
const { distanceKm } = require("../utils/distance");

function findDriver(pickup, radiusKm, requestedCarType) {
  const strategy = (
    process.env.DRIVER_MATCHING_STRATEGY || "nearest"
  ).toLowerCase();

  if (!["nearest", "highest-rated"].includes(strategy)) {
    throw new Error(
      "DRIVER_MATCHING_STRATEGY must be nearest or highest-rated"
    );
  }

  const nearby = [...store.drivers.values()].filter(
    (driver) =>
      driver.available &&
      distanceKm(pickup, driver.location) <= radiusKm
  );

  function rank(drivers) {
    return drivers.sort((a, b) => {
      if (strategy === "highest-rated" && b.rating !== a.rating) {
        return b.rating - a.rating;
      }

      return distanceKm(pickup, a.location) -
        distanceKm(pickup, b.location);
    })[0] || null;
  }

  // Prefer the requested vehicle type first.
  const exact = rank(
    nearby.filter((driver) => driver.carType === requestedCarType)
  );

  if (exact) {
    return { driver: exact, upgraded: false };
  }

  // A Hatchback request can use a Sedan at no extra cost.
  if (requestedCarType === "Hatchback") {
    const sedan = rank(
      nearby.filter((driver) => driver.carType === "Sedan")
    );

    if (sedan) {
      return { driver: sedan, upgraded: true };
    }
  }

  return { driver: null, upgraded: false };
}

module.exports = { findDriver };
