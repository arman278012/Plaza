
const rideService = require("../services/ride.service");
const { sendError } = require("../utils/errors");

function createRide(req, res) {
  try {
    const ride = rideService.createRide(req.body);

    return res.status(201).json({
      ride,
      message: ride.upgraded
        ? "Upgraded to Sedan at no extra cost"
        : "Ride booked"
    });
  } catch (error) {
    return sendError(
      res,
      error.status || 400,
      error.code || "RIDE_ERROR",
      error.message
    );
  }
}

function endRide(req, res) {
  try {
    const ride = rideService.endRide(
      req.params.id,
      req.body.distanceKm
    );

    return res.json({ ride, fare: ride.fare });
  } catch (error) {
    return sendError(
      res,
      error.status || 400,
      error.code || "RIDE_ERROR",
      error.message
    );
  }
}

function applyCoupon(req, res) {
  try {
    const ride = rideService.applyRideCoupon(
      req.params.id,
      req.body.code
    );

    return res.json({
      ride,
      message: "Coupon applied; discount will be calculated on final fare"
    });
  } catch (error) {
    return sendError(
      res,
      error.status || 400,
      error.code || "INVALID_COUPON",
      error.message
    );
  }
}

function cancelRide(req, res) {
  try {
    const ride = rideService.cancelRide(req.params.id);

    return res.json({
      ride,
      cancellationFee: ride.cancellationFee,
      message: "Ride cancelled successfully"
    });
  } catch (error) {
    return sendError(
      res,
      error.status || 400,
      error.code || "CANCELLATION_ERROR",
      error.message
    );
  }
}

module.exports = {
  createRide,
  endRide,
  applyCoupon,
  cancelRide
};
