const request = require("supertest");
const express = require("express");

const app = express();

app.get("/api/payments/getUndonePayments", async (req, res) => {
  res.status(200).json({ name: "john" });
});

describe("supertest example", () => {
  it("demo", async () => {
    const result = await request(app)
      .get("/api/payments/getUndonePayments")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "15")
      .expect(200);

    expect(result.text).toEqual(JSON.stringify({ name: "john" }));
  });
});
