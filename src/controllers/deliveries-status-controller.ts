import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/database/prisma';
import { z } from 'zod';

class DeliveriesStatusController {
  async update(request: Request, response: Response, next: NextFunction) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    const bodySchema = z.object({
      status: z.enum(['processing', 'shipped', 'delivered'])
    });

    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    await prisma.delivery.update({
      where: { id },
      data: { status },
    });

    await prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        description: status,
      }
    })

    return response.json({ message: `Delivery status updated to ${status}` });

  }
}

export { DeliveriesStatusController };