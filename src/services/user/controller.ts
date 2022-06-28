import { NextFunction, Request, Response } from 'express';
import { PrismaClient, UserType } from '@prisma/client';

const prisma = new PrismaClient();


export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, vendorName, bio, location } = req.body;
  const user = (req as any).user

  if (UserType.CUSTOMER == user.userType) {
    // Edit customer user
    if (firstName && lastName) {
      const exsitingCustomer = await prisma.customer.findUnique({ where: { id: parseInt(user.id) } })
      if (exsitingCustomer) {

        try {
          await prisma.customer.update({
            where: {
              id: exsitingCustomer.id
            },
            data: {
              firstName: firstName,
              lastName: lastName,
            }
          })
          return res.status(200).json({ success: true })
        } catch (error) {
          console.log('err', error);
          return res.status(500).json({ message: 'something went wrong' })
        }

      } else {
        return res.status(404).json({ message: 'Customer not found' })
      }

    } else {
      return res.status(400).send({ message: 'Incomplete parameter' });
    }
  } else {
    // Edit vendor user
    if (vendorName && bio && location) {
      const exsitingVendor = await prisma.vendor.findUnique({ where: { id: parseInt(user.id) } })
      if (exsitingVendor) {

        try {
          await prisma.vendor.update({
            where: {
              id: exsitingVendor.id
            },
            data: {
              vendorName: vendorName,
              bio: bio,
              location: location,
            }
          })
          return res.status(200).json({ success: true })
        } catch (error) {
          console.log('err', error);
          return res.status(500).json({ message: 'something went wrong' })
        }

      } else {
        return res.status(404).json({ message: 'Vendor not found' })
      }
    }
  }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (user.userType === UserType.CUSTOMER) {

    try {
      const getUser = await prisma.customer.findUnique({ where: { id: parseInt(user.id) } })

      if (getUser) {
        return res.status(200).json(getUser)
      } else {
        return res.status(404).json({ message: "User not found" })

      }
    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'something went wrong' })
    }
  } else {

    try {
      const getUser = await prisma.vendor.findUnique({ where: { id: parseInt(user.id) } })

      if (getUser) {
        return res.status(200).json(getUser)
      } else {
        return res.status(404).json({ message: "User not found" })

      }
    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'something went wrong' })
    }
  }

};

export const addOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  const { name, description, price, location, tags, picture } = req.body;

  if (user.userType === UserType.VENDOR ) {

    try {
        
        const order = await prisma.order.create({
          data: {
            name: name,
            description: description,
            price: parseFloat(price),
            location: location,
            picture: picture,
            vendorId: parseInt(user.id),
            Tag: tags
          }
        })
       
      return res.status(200).json({ success: true })

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'something went wrong' })
    }
  } else {
    return res.status(404).json({ message: 'User not found please login first' })

  }

};

export const editOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  const { orderId, name, description, price, location, tags, picture } = req.body;
  if (user.userType === UserType.VENDOR) {

    try {
      const existingOrder = await prisma.order.findUnique({ where: { id: parseInt(orderId) } })

      if (existingOrder) {
        await prisma.order.update({
          where: { id: existingOrder.id },
          data: {
            name: name,
            description: description,
            price: price,
            location: location,
            picture: picture,
            Tag: tags
          }
        })
       
        return res.status(200).json({ message: "Order has been upadted" })
      } else {
        return res.status(404).json({ message: "Order not found" })
      }

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'something went wrong' })
    }
  } else {
    return res.status(404).json({ message: 'User not found please login first' })
  }
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (user.userType === UserType.VENDOR) {

    try {
      const order = await prisma.order.findMany({ where: {vendorId: parseInt(user.id)}})

      return res.status(200).json(order)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'something went wrong' })
    }
  }

};

export const getSingleOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  const { orderId } = req.params
  
  if (user.userType === UserType.VENDOR) {

    try {
      const order = await prisma.order.findUnique({ where: {id: parseInt(orderId)}})

      return res.status(200).json(order)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'something went wrong' })
    }
  }

};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (user.userType === UserType.CUSTOMER) {

    try {
      const order = await prisma.order.findMany()

      return res.status(200).json(order)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'something went wrong' })
    }
  }

};


export const orderFollow = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  const { orderId, follow } = req.body
  if (!orderId)
    return res
      .status(400)
      .json({ error: 'Request should have orderId' });

  try {

    if (follow) {

      const userFollowing = await prisma.followOrder.upsert({
        where: {
          unique_following_user: {
            userId: userId,
            orderId: orderId
          }
        },
        create: {
          userId: userId,
          orderId: orderId
        },
        update: {
          userId: userId,
          orderId: orderId
        },
      })

    } else {

      const userFollowing = await prisma.followOrder.delete({
        where: {
          unique_following_user: {
            userId: userId,
            orderId: orderId
          }
        }
      })

    }
    return res.status(200).json({ success: true });


  } catch (error) {
    return res.status(500).json(error);
  }
}


export const getOrderFollow = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  if (!userId)
    return res
      .status(400)
      .json({ error: 'Request should have userId' });

  try {

    const user = await prisma.customer.findUnique({ where: { id: userId }, include: { FollowOrder: true } })
    const orderCondition: Array<{ orderId: number }> = []

    if (user) {
      for (const order of user.FollowOrder) {
        orderCondition.push({ orderId: order.id })
      }
    }

    const FollowingOrder = await prisma.followOrder.findMany({
      include: { order: true }
    })
    var singleUserOrder: Array<any> = []
    const follow = FollowingOrder.map((value) => {
      if (value.userId == userId) {
        singleUserOrder.push(value.order)
      }
    })

    if (singleUserOrder.length) {
      return res.status(200).json(singleUserOrder);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}
