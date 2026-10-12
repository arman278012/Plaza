const express = require("express");
const router = express.Router();
const { createUser, getUserRides } = require("../controllers/users.controller");

router.post("/", createUser);
router.get("/:id/rides", getUserRides);

module.exports = router;
