const express = require("express");
const router = express.Router();
const controller = require("../controllers/drivers.controller");

router.post("/", controller.createDriver);
router.get("/nearby", controller.nearbyDrivers);
router.patch("/:id/location", controller.updateLocation);
router.get("/:id/rides", controller.driverRides);

module.exports = router;
