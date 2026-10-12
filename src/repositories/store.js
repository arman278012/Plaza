// Single source of truth for this assessment. Data resets when the server restarts.
const store = {
  users: new Map(),
  drivers: new Map(),
  rides: new Map(),
  coupons: new Map()
};

function resetStore() {
  Object.values(store).forEach((collection) => collection.clear());
}

module.exports = { store, resetStore };
