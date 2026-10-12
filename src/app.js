const express = require("express");
const usersRoutes = require("./routes/users.routes");
const driversRoutes = require("./routes/drivers.routes");
const ridesRoutes = require("./routes/rides.routes");
const couponsRoutes = require("./routes/coupons.routes");
const { errorHandler } = require("./utils/errors");

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/users", usersRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/rides", ridesRoutes);
app.use("/api/coupons", couponsRoutes);

app.use(errorHandler);
module.exports = app;
