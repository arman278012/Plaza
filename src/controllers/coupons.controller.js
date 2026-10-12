const couponService = require("../services/coupon.service");
const { sendError } = require("../utils/errors");

function createCoupon(req, res) {
  try {
    return res.status(201).json(couponService.createCoupon(req.body));
  } catch (error) {
    return sendError(res, error.status || 400, "COUPON_ERROR", error.message);
  }
}

function deleteCoupon(req, res) {
  if (!couponService.deleteCoupon(req.params.code)) {
    return sendError(res, 404, "COUPON_NOT_FOUND", "Coupon not found");
  }
  return res.status(204).end();
}

module.exports = { createCoupon, deleteCoupon };
