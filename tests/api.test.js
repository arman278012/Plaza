const request = require("supertest");
const app = require("../src/app");
const { resetStore } = require("../src/repositories/store");

beforeEach(() => resetStore());

describe("API workflow", () => {
  test("registers user and driver, books and completes ride", async () => {
    const user = await request(app).post("/api/users").send({ name: "Arman" });
    expect(user.status).toBe(201);
    const driver = await request(app).post("/api/drivers").send({
      name: "Driver One", carType: "Sedan", location: { lat: 12.9716, lng: 77.5946 }
    });
    expect(driver.status).toBe(201);
    const booking = await request(app).post("/api/rides").send({
      userId: user.body.id,
      pickup: { lat: 12.9716, lng: 77.5946 },
      destination: { lat: 12.9816, lng: 77.5946 },
      carType: "Sedan"
    });
    expect(booking.status).toBe(201);
    const completed = await request(app).patch(`/api/rides/${booking.body.ride.id}/end`).send({ distanceKm: 7 });
    expect(completed.status).toBe(200);
    expect(completed.body.fare).toBe(54);
    expect(completed.body.ride.status).toBe("COMPLETED");
  });

  test("rejects booking when no driver is available", async () => {
    const user = await request(app).post("/api/users").send({ name: "Arman" });
    const response = await request(app).post("/api/rides").send({
      userId: user.body.id,
      pickup: { lat: 12.9716, lng: 77.5946 },
      destination: { lat: 12.9816, lng: 77.5946 },
      carType: "Sedan"
    });
    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("NO_DRIVER_AVAILABLE");
  });

  test("upgrades Hatchback request to Sedan for free", async () => {
    const user = await request(app).post("/api/users").send({ name: "Arman" });
    await request(app).post("/api/drivers").send({
      name: "Sedan Driver", carType: "Sedan", location: { lat: 12.9716, lng: 77.5946 }
    });
    const response = await request(app).post("/api/rides").send({
      userId: user.body.id, pickup: { lat: 12.9716, lng: 77.5946 },
      destination: { lat: 12.9816, lng: 77.5946 }, carType: "Hatchback"
    });
    expect(response.status).toBe(201);
    expect(response.body.ride.upgraded).toBe(true);
    expect(response.body.ride.carType).toBe("Sedan");
  });

  test("applies percentage coupon", async () => {
    const user = await request(app).post("/api/users").send({ name: "Arman" });
    await request(app).post("/api/drivers").send({
      name: "Driver", carType: "Sedan", location: { lat: 12.9716, lng: 77.5946 }
    });
    const booking = await request(app).post("/api/rides").send({
      userId: user.body.id, pickup: { lat: 12.9716, lng: 77.5946 },
      destination: { lat: 12.9816, lng: 77.5946 }, carType: "Sedan"
    });
    await request(app).post("/api/coupons").send({ code: "SAVE20", type: "PERCENTAGE", value: 20 });
    const applied = await request(app).post(`/api/rides/${booking.body.ride.id}/coupon`).send({ code: "SAVE20" });
    expect(applied.status).toBe(200);
    const ended = await request(app).patch(`/api/rides/${booking.body.ride.id}/end`).send({ distanceKm: 7 });
    expect(ended.body.fare).toBeCloseTo(43.2);
  });
});
