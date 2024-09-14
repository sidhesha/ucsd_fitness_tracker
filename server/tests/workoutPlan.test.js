const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const initializeWorkoutPlans = require('../util/initializeWorkoutPlans');

afterAll(async () => {
    await mongoose.connection.close();
});
beforeAll(initializeWorkoutPlans);

describe("GET /api/workout/bulk/1", () => {
    it("should return some content", async () => {
        const path = "/api/workout/bulk/1";
        const res = await request(app).get(path);
        expect(res.statusCode).toBe(200);
        expect(res.text.length).toBeGreaterThan(0);
    });
});
