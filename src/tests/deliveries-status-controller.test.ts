import request from 'supertest';
import { prisma } from '@/database/prisma';
import { app } from '@/app';

describe("DeliveriesStatusController", () => {
  let user_id: string;
  let token: string;
  let delivery_id: string;

  afterAll(async () => {
    await prisma.deliveryLog.deleteMany({ where: { deliveryId: delivery_id } });
    await prisma.delivery.deleteMany({ where: { userId: user_id } });
    await prisma.user.delete({ where: { id: user_id } })
  })

  it("should change the status of a delivery", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Delivery Status Test User",
      email: "deliverystatustestuser@example.com",
      password: "password123",
    });

    user_id = userResponse.body.id;

    await prisma.user.update({
      where: { id: user_id },
      data: { role: "sale" },
    });

    const sessionResponse = await request(app).post("/sessions").send({
      email: "deliverystatustestuser@example.com",
      password: "password123",
    });

    token = sessionResponse.body.token;

    const deliveryResponse = await request(app).post("/deliveries").send({
      user_id,
      description: "Test delivery description",
    }).set("Authorization", `Bearer ${token}`);

    const deliveryRecord = await prisma.delivery.findFirst({
      where: { userId: user_id },
      select: { id: true },
    });

    if (!deliveryRecord) throw new Error('Delivery not found');
    delivery_id = deliveryRecord.id;


    const deliveryStatusResponse = await request(app)
      .patch(`/deliveries/${delivery_id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'shipped' });

    expect(deliveryStatusResponse.status).toBe(200);
    expect(deliveryStatusResponse.body.message).toBe('Delivery status updated to shipped');
  });
});