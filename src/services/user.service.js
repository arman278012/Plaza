const { randomUUID } = require("crypto");
const { store } = require("../repositories/store");

function createUser(name) {
  if (typeof name !== "string" || !name.trim()) {
    const error = new Error("Name is required");
    error.status = 400;
    throw error;
  }
  const user = { id: randomUUID(), name: name.trim(), createdAt: new Date().toISOString() };
  store.users.set(user.id, user);
  return user;
}

function getUser(id) {
  return store.users.get(id);
}

function getUserRides(id) {
  return [...store.rides.values()].filter((ride) => ride.userId === id);
}

module.exports = { createUser, getUser, getUserRides };
