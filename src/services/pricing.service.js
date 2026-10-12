
const pricingConfig = require("../config/pricing");

function calculateFare(
  distanceKm,
  carType = "Sedan",
  multiplier = 1
) {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    throw new Error("Distance must be a positive number");
  }

  if (!Number.isFinite(multiplier) || multiplier < 1) {
    throw new Error("Surge multiplier must be at least 1");
  }

  const config = pricingConfig[carType];

  if (!config) {
    throw new Error("Unsupported car type");
  }

  let total = 0;
  let remaining = distanceKm;
  let previousLimit = 0;

  for (const tier of config.tiers) {
    const width = tier.upToKm - previousLimit;
    const kmInTier = Math.min(remaining, width);

    if (kmInTier > 0) {
      total += kmInTier * tier.rate;
      remaining -= kmInTier;
    }

    previousLimit = tier.upToKm;

    if (remaining <= 0) break;
  }

  const baseFare = Math.max(config.minimumFare, total);

  return Math.round(baseFare * multiplier * 100) / 100;
}

module.exports = { calculateFare };
