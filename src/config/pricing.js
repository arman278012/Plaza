// Sedan rates follow the assignment example. Hatchback rates are an explicit assumption.
module.exports = {
  Sedan: {
    minimumFare: 50,
    tiers: [
      { upToKm: 2, rate: 10 },
      { upToKm: 5, rate: 8 },
      { upToKm: Infinity, rate: 5 }
    ]
  },
  Hatchback: {
    minimumFare: 40,
    tiers: [
      { upToKm: 2, rate: 8 },
      { upToKm: 5, rate: 6 },
      { upToKm: Infinity, rate: 4 }
    ]
  }
};
