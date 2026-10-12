
const { calculateFare } = require("../src/services/pricing.service");

describe("pricing", () => {
  test("applies minimum Sedan fare", () =>
    expect(calculateFare(1, "Sedan")).toBe(50));

  test("calculates progressive Sedan tiers", () =>
    expect(calculateFare(7, "Sedan")).toBe(54));

  test("uses separate Hatchback rates", () =>
    expect(calculateFare(7, "Hatchback")).toBe(42));

  test("rejects invalid distance and car type", () => {
    expect(() => calculateFare(0, "Sedan")).toThrow();
    expect(() => calculateFare(-1, "Sedan")).toThrow();
    expect(() => calculateFare(3, "SUV")).toThrow();
  });
});
