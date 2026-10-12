const express = require("express");
const router = express.Router();
const controller = require("../controllers/coupons.controller");

router.post("/", controller.createCoupon);
router.delete("/:code", controller.deleteCoupon);

module.exports = router;
