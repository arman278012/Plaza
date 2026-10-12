const userService = require("../services/user.service");
const { sendError } = require("../utils/errors");

function createUser(req, res) {
  try {
    return res.status(201).json(userService.createUser(req.body.name));
  } catch (error) {
    return sendError(res, error.status || 400, error.code || "VALIDATION_ERROR", error.message);
  }
}

function getUserRides(req, res) {
  if (!userService.getUser(req.params.id)) return sendError(res, 404, "USER_NOT_FOUND", "User not found");
  return res.json({ rides: userService.getUserRides(req.params.id) });
}

module.exports = { createUser, getUserRides };
