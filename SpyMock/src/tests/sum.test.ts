import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../index";
import { prismaClient } from "../__mocks__/db";

// deep mock
vi.mock("../db");

// shallow mock
// vi.mock("../db", () => {
//   return {
//     prismaClient: {
//       request: {
//         create: vi.fn(),
//         // delete: vi.fn(),
//         // findMany: vi.fn(),
//         // findUnique: vi.fn(), // etc
//       },
//     },
//   };
// });

describe("Test SUM FX", () => {
  it("should return the sum of two numbers", async () => {
    prismaClient.request.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 1,
      answer: 3,
      type: "sum",
    });

    vi.spyOn(prismaClient.request, "create");
    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2,
    });

    expect(prismaClient.request.create).toHaveBeenCalledWith({
      data: {
        a: 1,
        b: 2,
        answer: 3,
        type: "sum",
      },
    });

    expect(res.body.answer).toBe(3);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it("should fail when the input is too large", async () => {
    const res = await request(app).post("/sum").send({
      a: 20000000,
      b: 2,
    });
    expect(res.body.message).toBe("Sorry, the input is too large");
    expect(res.statusCode).toBe(411);
  });
});

describe("POST /multiply", () => {
  it("should return the product of two numbers", async () => {
    const res = await request(app).post("/multiply").send({
      a: 11,
      b: 2,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(22);
  });

  it("should return right value if one number is negative", async () => {
    const res = await request(app).post("/multiply").send({
      a: -11,
      b: 2,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(-22);
  });
});
