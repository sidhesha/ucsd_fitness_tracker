const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const url = require("url");

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST /api/login", () => {
    it("should return 404", async () => {
        const res = await request(app).post("/api/login");
        expect(res.statusCode).toBe(404);
    });
});

describe("GET /api/login", () => {
    it("should return 302 redirect", async () => {
        const path = "/api/login";
        const res = await request(app).get(path);
        expect(res.statusCode).toBe(302);
        expect(url.resolve(path, res.headers.location)).toBe("/api/login/google");
    });
});
