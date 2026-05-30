import request from "supertest";
import { prisma } from "@/database/prisma";
import { app } from "@/app";

describe("DeliveriesController", () => {
  let user_id: string;
  let token: string;

  afterAll(async () => {
    await prisma.delivery.deleteMany({ where: { userId: user_id } });
    await prisma.user.delete({ where: { id: user_id } })
  })

  it("should create a new delivery", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Delivery Test User",
      email: "deliverytestuser@example.com",
      password: "password123",
    });

    user_id = userResponse.body.id;

    await prisma.user.update({
      where: { id: user_id },
      data: { role: "sale" },
    });

    const sessionResponse = await request(app).post("/sessions").send({
      email: "deliverytestuser@example.com",
      password: "password123",
    });

    token = sessionResponse.body.token;

    const deliveryResponse = await request(app).post("/deliveries").send({
      user_id,
      description: "Test delivery description",
    }).set("Authorization", `Bearer ${token}`);

    expect(deliveryResponse.status).toBe(201);
    expect(deliveryResponse.body.message).toBe("Create delivery");
  })
});