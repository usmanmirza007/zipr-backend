import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { PrismaClient, Status, UserType } from '@prisma/client';
import { attachPaymentMethod, createCustomer, createMethod, createPayment } from '../../../provider/stripe';

const prisma = new PrismaClient();

export const addPayment = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id

  const { name, cardNumber, cvv, expireDate, price, payment } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    return res.status(401).json({ message: "User not found please login again." })
  }

  if (!name || !cardNumber || !cvv || !expireDate || !price) {
    return res.status(400).json({ message: "Request should be valid fields." })
  }

  try {


    if (user && payment) {
      const sliptDate = expireDate.split('-')
      const year = parseInt(sliptDate[0])
      const month = parseInt(sliptDate[1])

      const { id: cus_id, email: cus_email } = await createCustomer(user.email, name)
      if (cus_id && cus_email) {

        const { id: pm_id } = await createMethod(cardNumber, month, year, cvv);
        const attachPayment = await attachPaymentMethod(pm_id, cus_id);
        const payment = await createPayment(price * 100, cus_id, pm_id, 'ZAR');


        if (payment) {
          await prisma.order.updateMany({
            where: {
              customerId: userId,
              status: Status.PENDING  // OrderStatus.PENDING
            },
            data: {
              status: Status.CAPTUREED  // OrderStatus.CAPTUREED
            }
          })
        }

      }

      return res.status(200).json({ success: true })
    } else {
      
      await prisma.order.updateMany({
        where: {
          customerId: userId,
          status: Status.PENDING  // OrderStatus.PENDING
        },
        data: {
          status: Status.CAPTUREED  // OrderStatus.CAPTUREED
        }
      })
      return res.status(200).json({ success: true })

    }

  } catch (error) {
    return res.status(500).json({ error: "Some error occurred" })

  }


};
