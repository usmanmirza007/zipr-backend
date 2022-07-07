import { NextFunction, Request, Response } from 'express';
import { PrismaClient, UserType } from '@prisma/client';
import { secret_key } from '../../../secret';
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient();


export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, vendorName, picture, bio, location, type } = req.body;
  const user = (req as any).user
    
    // Edit customer user
    if (firstName || lastName || picture || bio || location ) {
      const exsitingUser = await prisma.user.findUnique({ where: { id: parseInt(user.id) } })
      if (exsitingUser) {

        try {
          if (UserType.CUSTOMER == user.userType) {
            await prisma.user.update({
              where: {
                id: exsitingUser.id,
              },
              data: {
                firstName: firstName,
                lastName: lastName,
                picture: picture,
              }
            })
          } else {
            await prisma.user.update({
              where: {
                id: exsitingUser.id,
              },
              data: {
                firstName: firstName,
                lastName: lastName,
                picture: picture,
                vender: { update: { bio: bio, location: location } }
              }
            })
          }
         
          return res.status(200).json({ success: true })
        } catch (error) {
          console.log('err', error);
          return res.status(500).json({ message: 'something went wrong' })
        }

      } else {
        return res.status(404).json({ message: 'User not found' })
      }

    } else {
      return res.status(400).send({ message: 'Incomplete parameter' });
    }
 
}


export const changeUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.body;
  const user = (req as any).user
    
    if ( type ) {
      const exsitingUser = await prisma.user.findUnique({ where: { id: parseInt(user.id) } })
      if (exsitingUser) {

        try {
          const user = await prisma.user.update({
            where: {
              id: exsitingUser.id,
            },
            data: {
              userType: type,
              vender: {update: {isActive: type === UserType.VENDER ? true : false }},
              customer: {update: {isActive: type === UserType.CUSTOMER ? true : false }}
            }
          })
          const data = await jwt.sign({
            username: exsitingUser.email,
            userType: type,
            id: exsitingUser.id,
          }, secret_key.secret, {
            expiresIn: '4h',
            algorithm: secret_key.algorithms[0]
          });
          return res.status(200).json({ token: data, type: type })
        } catch (error) {
          console.log('err', error);
          return res.status(500).json({ message: 'something went wrong' })
        }

      } else {
        return res.status(404).json({ message: 'User not found' })
      }

    } else {
      return res.status(400).send({ message: 'Incomplete parameter' });
    }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  console.log('fofo', user.userType);
  
  if (user.userType === UserType.CUSTOMER) {
    console.log('test1');
    
    try {
      const getUser = await prisma.user.findUnique({ where: { id: parseInt(user.id) }, include: { customer: true } })

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
    console.log('test2');

    try {
      const getUser = await prisma.user.findUnique({ where: { id: parseInt(user.id) }, include: {vender: true} })

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

  if (user.userType === UserType.VENDER ) {

    try {
        
        const order = await prisma.order.create({
          data: {
            name: name,
            description: description,
            price: parseFloat(price),
            location: location,
            picture: picture,
            venderId: parseInt(user.id),
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
  if (user.userType === UserType.VENDER) {

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

  if (user.userType === UserType.VENDER) {

    try {
      const order = await prisma.order.findMany({ where: {venderId: parseInt(user.id)}})

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
  
  if (user.userType === UserType.VENDER) {

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

export const orderFavorite = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  const { orderId, favorite } = req.body
  if (!orderId)
    return res
      .status(400)
      .json({ error: 'Request should have orderId' });

  try {

    if (favorite) {

      await prisma.favoriteOrder.upsert({
        where: {
          unique_favorite_order: {
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

      await prisma.favoriteOrder.delete({
        where: {
          unique_favorite_order: {
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


export const getOrderFavorite = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  if (!userId)
    return res
      .status(400)
      .json({ error: 'Request should have userId' });

  try {

    const user = await prisma.customer.findUnique({ where: { id: userId }, include: { FavoriteOrder: true } })
    const orderCondition: Array<{ orderId: number }> = []

    if (user) {
      for (const order of user.FavoriteOrder) {
        orderCondition.push({ orderId: order.id })
      }
    }

    const favoriteOrder = await prisma.favoriteOrder.findMany({
      include: { order: true }
    })
    var singleUserFavoriteOrder: Array<any> = []
    favoriteOrder.map((value) => {
      if (value.userId == userId) {
        singleUserFavoriteOrder.push(value.order)
      }
    })

    if (singleUserFavoriteOrder.length) {
      return res.status(200).json(singleUserFavoriteOrder);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}
