const { store } = require("../repositories/store");

function createCoupon({ code, type, value }) {
  const normalizedCode = typeof code === "string" ? code.trim().toUpperCase() : "";
  if (!normalizedCode || !["PERCENTAGE", "FLAT"].includes(type) ||
    !Number.isFinite(value) || value <= 0 || (type === "PERCENTAGE" && value > 100)) {
    throw new Error("Provide code, type (PERCENTAGE or FLAT), and a valid positive value");
  }
  if (store.coupons.has(normalizedCode)) {
    const error = new Error("Coupon already exists");
    error.status = 409;
    throw error;
  }
  const coupon = { code: normalizedCode, type, value, active: true, createdAt: new Date().toISOString() };
  store.coupons.set(normalizedCode, coupon);
  return coupon;
}

function getCoupon(code) {
  return store.coupons.get(String(code || "").trim().toUpperCase());
}

function deleteCoupon(code) {
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (!store.coupons.has(normalizedCode)) return false;
  return store.coupons.delete(normalizedCode);
}

function applyCoupon(fare, coupon) {
  if (!coupon || !coupon.active) throw new Error("Invalid or inactive coupon");
  const discount = coupon.type === "PERCENTAGE"
    ? fare * coupon.value / 100
    : coupon.type === "FLAT" ? coupon.value : NaN;
  if (!Number.isFinite(discount)) throw new Error("Unsupported coupon type");
  return Math.round(Math.max(0, fare - discount) * 100) / 100;
}

module.exports = { createCoupon, getCoupon, deleteCoupon, applyCoupon };