import express from "express";
import { z } from "zod";
import { prismaClient } from "./db";

export const app = express();
app.use(express.json());

const sumInput = z.object({
  a: z.number(),
  b: z.number(),
});

const multiplyInput = z.object({
  a: z.number(),
  b: z.number(),
});

app.post("/sum", async (req, res) => {
  const parsedResponse = sumInput.safeParse(req.body);

  if (!parsedResponse.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  if (parsedResponse.data.a > 10000 || parsedResponse.data.b > 10000) {
    return res.status(411).json({
      message: "Sorry, the input is too large",
    });
  }

  const request = await prismaClient.request.create({
    data: {
      a: parsedResponse.data.a,
      b: parsedResponse.data.b,
      answer: parsedResponse.data.a + parsedResponse.data.b,
      type: "sum",
    },
  });

  console.log("request", request);

  const result = parsedResponse.data.a + parsedResponse.data.b;

  res.json({
    answer: result,

    id: request.id,
  });
});

app.post("/multiply", async (req, res) => {
  const parsedResponse = multiplyInput.safeParse(req.body);

  if (!parsedResponse.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  await prismaClient.request.create({
    data: {
      a: parsedResponse.data.a,
      b: parsedResponse.data.b,
      answer: parsedResponse.data.a * parsedResponse.data.b,
      type: "multiply",
    },
  });
  const result = parsedResponse.data.a * parsedResponse.data.b;

  res.status(200);
  res.json({
    answer: result,
  });
});
