
const express = require("express");
const router = express.Router();
const controller = require("../controllers/rides.controller");

router.post("/", controller.createRide);
router.patch("/:id/end", controller.endRide);
router.post("/:id/coupon", controller.applyCoupon);
router.patch("/:id/cancel", controller.cancelRide);

module.exports = router;
