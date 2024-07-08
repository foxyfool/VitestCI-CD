"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const db_1 = require("../__mocks__/db");
// deep mock
vitest_1.vi.mock("../db");
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
(0, vitest_1.describe)("Test SUM FX", () => {
    (0, vitest_1.it)("should return the sum of two numbers", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.prismaClient.request.create.mockResolvedValue({
            id: 1,
            a: 1,
            b: 1,
            answer: 3,
            type: "sum",
        });
        const res = yield (0, supertest_1.default)(index_1.app).post("/sum").send({
            a: 1,
            b: 2,
        });
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.answer).toBe(3);
    }));
    (0, vitest_1.it)("should fail when the input is too large", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post("/sum").send({
            a: 20000000,
            b: 2,
        });
        (0, vitest_1.expect)(res.body.message).toBe("Sorry, the input is too large");
        (0, vitest_1.expect)(res.statusCode).toBe(411);
    }));
});
(0, vitest_1.describe)("POST /multiply", () => {
    (0, vitest_1.it)("should return the product of two numbers", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post("/multiply").send({
            a: 11,
            b: 2,
        });
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.answer).toBe(22);
    }));
    (0, vitest_1.it)("should return right value if one number is negative", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post("/multiply").send({
            a: -11,
            b: 2,
        });
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.answer).toBe(-22);
    }));
});
