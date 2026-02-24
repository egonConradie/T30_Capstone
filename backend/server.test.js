const request = require("supertest");
const app = require("./server");

describe("GitHub Explorer API", () => {
  test("GET /api/search/:username returns search results", async () => {
    const res = await request(app).get("/api/search/torvalds");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("items");
  });

  test("GET /api/user/:username returns profile and repos", async () => {
    const res = await request(app).get("/api/user/torvalds");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("profile");
    expect(res.body).toHaveProperty("repos");
  });

  test("GET /api/repo/:owner/:repo returns details and commits", async () => {
    const res = await request(app).get("/api/repo/torvalds/linux");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("details");
    expect(res.body).toHaveProperty("commits");
  });
});
