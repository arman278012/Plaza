const { randomUUID } = require("crypto");
const { store } = require("../repositories/store");
const { validLocation, distanceKm } = require("../utils/distance");
const { getDriverRides } = require("../services/ride.service");
const { sendError } = require("../utils/errors");

function createDriver(req, res) {
  const { name, carType, location } = req.body;
  if (typeof name !== "string" || !name.trim() ||
    !["Sedan", "Hatchback"].includes(carType) || !validLocation(location)) {
    return sendError(res, 400, "VALIDATION_ERROR", "name, valid carType, and valid location are required");
  }
  const driver = {
    id: randomUUID(), name: name.trim(), carType,
    location: { lat: location.lat, lng: location.lng },
    rating: Number.isFinite(req.body.rating) ? Math.max(0, Math.min(5, req.body.rating)) : 5,
    available: true, createdAt: new Date().toISOString()
  };
  store.drivers.set(driver.id, driver);
  return res.status(201).json(driver);
}

function updateLocation(req, res) {
  const driver = store.drivers.get(req.params.id);
  if (!driver) return sendError(res, 404, "DRIVER_NOT_FOUND", "Driver not found");
  if (!validLocation(req.body.location)) return sendError(res, 400, "VALIDATION_ERROR", "Valid location is required");
  driver.location = { lat: req.body.location.lat, lng: req.body.location.lng };
  return res.json(driver);
}

function nearbyDrivers(req, res) {
  const location = { lat: Number(req.query.lat), lng: Number(req.query.lng) };
  const radiusKm = req.query.radiusKm === undefined ? 5 : Number(req.query.radiusKm);
  const carType = req.query.carType || "Sedan";
  if (!validLocation(location) || !Number.isFinite(radiusKm) || radiusKm <= 0 ||
    !["Sedan", "Hatchback"].includes(carType)) {
    return sendError(res, 400, "VALIDATION_ERROR", "Valid coordinates, radiusKm, and carType are required");
  }
  const drivers = [...store.drivers.values()]
    .filter((driver) => driver.available &&
      (driver.carType === carType || (carType === "Hatchback" && driver.carType === "Sedan")))
    .map((driver) => ({ ...driver, distanceKm: distanceKmBetween(location, driver.location) }))
    .filter((driver) => driver.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
  return res.json({ count: drivers.length, drivers });
}

function distanceKmBetween(a, b) { return distanceKm(a, b); }

function driverRides(req, res) {
  if (!store.drivers.has(req.params.id)) return sendError(res, 404, "DRIVER_NOT_FOUND", "Driver not found");
  return res.json({ rides: getDriverRides(req.params.id) });
}

module.exports = { createDriver, updateLocation, nearbyDrivers, driverRides };
