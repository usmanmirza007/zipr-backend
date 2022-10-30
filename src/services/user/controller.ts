import { NextFunction, Request, Response } from 'express';
import { PrismaClient, Status, UserType } from '@prisma/client';
import { secret_key } from '../../../secret';
const jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs');

const prisma = new PrismaClient();


export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, picture, bio, location, type, password } = req.body;
  const user = (req as any).user

  // Edit customer user
  if (firstName || lastName || picture || bio || location || password) {
    const exsitingUser = await prisma.user.findUnique({ where: { id: parseInt(user.id) } })
    if (exsitingUser) {

      try {
        var hash = bcrypt.hashSync(password, 8);
        if (UserType.CUSTOMER == user.userType) {
          await prisma.user.update({
            where: {
              id: exsitingUser.id,
            },
            data: {
              firstName: firstName,
              lastName: lastName,
              picture: picture,
              password: password ? hash : exsitingUser.password,
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
              password: password ? hash : exsitingUser.password,
              vender: { update: { bio: bio, location: location } }
            }
          })
        }

        return res.status(200).json({ success: true })
      } catch (error) {
        console.log('err', error);
        return res.status(500).json({ message: 'Something went wrong' })
      }

    } else {
      return res.status(404).json({ message: 'User not found' })
    }

  } else {
    return res.status(400).json({ message: 'Incomplete parameter' });
  }

}


export const changeUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.body;
  const user = (req as any).user

  if (type) {
    const exsitingUser = await prisma.user.findUnique({ where: { id: parseInt(user.id) } })
    if (exsitingUser) {

      try {
        const user = await prisma.user.update({
          where: {
            id: exsitingUser.id,
          },
          data: {
            userType: type,
            vender: { update: { isActive: type === UserType.VENDER ? true : false } },
            customer: { update: { isActive: type === UserType.CUSTOMER ? true : false } }
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
        return res.status(500).json({ message: 'Something went wrong' })
      }

    } else {
      return res.status(404).json({ message: 'User not found' })
    }

  } else {
    return res.status(400).json({ message: 'Incomplete parameter' });
  }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (user.userType != UserType.CUSTOMER) {

    try {
      const getUser = await prisma.user.findUnique({ where: { id: parseInt(user.id) }, include: { vender: true } })

      if (getUser) {
        return res.status(200).json(getUser)
      } else {
        return res.status(404).json({ message: "User not found" })

      }
    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  } else {

    try {
      const getUser = await prisma.user.findUnique({ where: { id: parseInt(user.id) }, include: { customer: true } })

      if (getUser) {
        return res.status(200).json(getUser)
      } else {
        return res.status(404).json({ message: "User not found" })

      }
    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }

};

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  const { name, description, price, location, tags, pictures, category } = req.body;

  if (user.userType === UserType.VENDER) {

    try {

      const order = await prisma.product.create({
        data: {
          name: name,
          description: description,
          price: parseFloat(price),
          location: location,
          picture: pictures,
          venderId: parseInt(user.id),
          tag: tags,
          category: category,
        }
      })

      const exsitingCategory = (await prisma.category.findMany()).find((val) => val.label === category)
      if (!exsitingCategory) {
        await prisma.category.create({
          data: {
            label: category,
            value: category
          }
        })
      }
      return res.status(200).json({ success: true })

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    return res.status(404).json({ message: 'User not found please login first' })

  }

};

export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  const { productId, name, description, price, location, tags, picture, category } = req.body;

  if (user.userType === UserType.VENDER) {

    try {
      const existingProduct = await prisma.product.findUnique({ where: { id: parseInt(productId) } })

      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            name: name,
            category: category,
            description: description,
            price: parseFloat(price),
            location: location,
            picture: picture,
            tag: tags
          }
        })
        const singleCategory = await prisma.category.findFirst({ where: { label: existingProduct.category } })

        if (singleCategory) {

          await prisma.category.update({
            where: { id: singleCategory.id },
            data: {
              label: category,
              value: category
            }
          })
        }
        return res.status(200).json({ message: "Order has been upadted" })
      } else {
        return res.status(404).json({ message: "Order not found" })
      }

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    return res.status(404).json({ message: 'User not found please login first' })
  }
};

export const getUserProduct = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (user.userType === UserType.VENDER) {

    try {
      const products = await prisma.product.findMany({ where: { venderId: parseInt(user.id) } })

      return res.status(200).json(products)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }

};

export const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  const { productId } = req.params

  if (user.userType === UserType.VENDER) {

    try {
      const products = await prisma.product.findUnique({ where: { id: parseInt(productId) } })

      return res.status(200).json(products)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }

};

export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (user.userType === UserType.CUSTOMER) {

    try {
      const products = await prisma.product.findMany({ include: { vender: { include: { User: true } } }, orderBy: { id: 'desc' } })

      return res.status(200).json(products)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }

};


export const followPRoduct = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  const { productId, follow } = req.body
  if (!productId)
    return res
      .status(400)
      .json({ message: 'Request should have productId' });

  try {

    if (follow) {

      const userFollowing = await prisma.followProduct.upsert({
        where: {
          unique_following_products: {
            userId: userId,
            productId: productId
          }
        },
        create: {
          userId: userId,
          productId: productId
        },
        update: {
          userId: userId,
          productId: productId
        },
      })

    } else {

      const userFollowing = await prisma.followProduct.delete({
        where: {
          unique_following_products: {
            userId: userId,
            productId: productId
          }
        }
      })

    }
    return res.status(200).json({ success: true });


  } catch (error) {
    return res.status(500).json(error);
  }
}

export const getFollowProduct = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  if (!userId)
    return res
      .status(400)
      .json({ message: 'Request should have userId' });

  try {

    const user = await prisma.customer.findUnique({ where: { id: userId }, include: { FollowProduct: true } })
    const orderCondition: Array<{ orderId: number }> = []

    if (user) {
      for (const prodcut of user.FollowProduct) {
        orderCondition.push({ orderId: prodcut.id })
      }
    }

    const FollowingProduct = await prisma.followProduct.findMany({
      include: { product: true }
    })
    var singleUserProduct: Array<any> = []
    const follow = FollowingProduct.map((value) => {
      if (value.userId == userId) {
        singleUserProduct.push(value.product)
      }
    })

    if (singleUserProduct.length) {
      return res.status(200).json(singleUserProduct);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const favoriteProduct = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  const { productId, favorite } = req.body
  if (!productId)
    return res
      .status(400)
      .json({ message: 'Request should have productId' });

  try {

    if (favorite) {

      await prisma.favoriteProduct.upsert({
        where: {
          unique_favorite_products: {
            userId: userId,
            productId: productId
          }
        },
        create: {
          userId: userId,
          productId: productId
        },
        update: {
          userId: userId,
          productId: productId
        },
      })

      return res.status(200).json({ success: true });
    } else {

      await prisma.favoriteProduct.delete({
        where: {
          unique_favorite_products: {
            userId: userId,
            productId: productId
          }
        }
      })
      return res.status(200).json({ success: false });
    }


  } catch (error) {
    return res.status(500).json(error);
  }
}


export const getFavoriteProduct = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id

  try {

    // const favoriteProducts = await prisma.user.findMany({ include: { customer: { include: { FavoriteProduct: { include: { product: { include: { vender: { include: { User: true } } } } } } } } } })
    // const favoriteLists = await prisma.user.findMany({ include: { customer: { include: { FavoriteProduct: true } } } })
    const favoriteLists = await prisma.favoriteProduct.findMany({ where: {userId: userId}, include: {product: {include: {vender: {include: {User: true }}}}}})
    // let productIdCondition: Array<{ id: number }> = []
    
    // if (favoriteLists.length) {
    //   for (const favoriteList of favoriteLists) {
    //     if (favoriteList.customer.FavoriteProduct.length) {
    //       for (const favorite of favoriteList.customer.FavoriteProduct) {
    //         productIdCondition.push({ id: favorite.productId })
    //       }
    //     }
    //   }
    // }

    // const favoriteProducts = await prisma.product.findMany({ where: { OR: productIdCondition }, include: { vender: { include: { User: true } } } })
    
    return res.status(200).json(favoriteLists);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const getSingleFavoriteProduct = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  try {
    const favoriteLists = await prisma.favoriteProduct.findMany({ where: { userId: userId } })
    return res.status(200).json(favoriteLists);

  } catch (error) {
    console.log('error', error);
    return res.status(500).json(error);
  }
}


export const getCategory = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  if (!userId)
    return res
      .status(400)
      .json({ message: 'Request should have userId' });

  try {
    const categories = [
      { label: "All", value: "All" },
      { label: "Books", value: "Books" },
      { label: "Clothing", value: "Clothing" },
      { label: "Fashion", value: "Fashion" },
      { label: "Wearable Accessories", value: "Wearable Accessories" },
      { label: "Stationery", value: "Stationery" },
      { label: "Office Supplies", value: "Office Supplies" },
      { label: "Beauty & Personal Care", value: "Beauty & Personal Care" },
      { label: "Furniture", value: "Furniture" },
      { label: "Home & Appliances", value: "Home & Appliances" },
      { label: "Tools & Home Improvements", value: "Tools & Home Improvements" },
      { label: "Automotive", value: "Automotive" },
      { label: "Exercise & Fitness", value: "Exercise & Fitness" },
      { label: "Sports", value: "Sports" },
      { label: "Electronics", value: "Electronics" },
      { label: "Personal Computers", value: "Personal Computers" },
      { label: "Tech Accessories", value: "Tech Accessories" },
      { label: "ICT", value: "ICT" },
      { label: "Health and Hygiene", value: "Health and Hygiene" },
      { label: "Industrial & Scientific", value: "Industrial & Scientific" },
      { label: "Academics", value: "Academics" },
      { label: "Academic Services", value: "Academic Services" },
      { label: "Education", value: "Education" },
      { label: "Cuisine", value: "Cuisine" },
      { label: "Grocery & Food", value: "Grocery & Food" },
      { label: "Arts & Crafts", value: "Arts & Crafts" },
      { label: "Creative Art", value: "Creative Art" },
      { label: "Entertainment", value: "Entertainment" },
      { label: "Social", value: "Social" },
      { label: "Equipment", value: "Equipment" },
      { label: "DIY", value: "DIY" },
      { label: "DIY Services", value: "DIY Services" },
      { label: "Camera & Photo", value: "Camera & Photo" },
      { label: "Music & Video", value: "Music & Video" },
      { label: "Outdoors", value: "Outdoors" },
      { label: "Software", value: "Software" },
      { label: "Video Games", value: "Video Games" },
      { label: "Musical Instruments", value: "Musical Instruments" },
      { label: "Financial Services", value: "Financial Services" },
      { label: "Party Supplies", value: "Party Supplies" },
      { label: "Convenience Suppies", value: "Convenience Suppies" },
      { label: "Other", value: "Other" }
    ]

    // for (const cate of categories) {
    //   await prisma.category.create({data: {label: cate.label, value: cate.value}})

    // }
    const category = await prisma.category.findMany()

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const addOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  const { orderId, productId, price, quantity, orderStatus } = req.body;

  let status: Status = orderStatus

  if (orderStatus === Status.PENDING) {
    status = Status.PENDING;
  }

  if (user.userType === UserType.CUSTOMER) {

    try {

      if (orderId) {

        const getOrderItem = await prisma.orderItem.findMany({ where: { orderId: parseInt(orderId) }, include: { product: true } })
        let totalPrice = price
        for (const item of getOrderItem) {

          totalPrice += item.product.price
        }

        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: orderId,
            productId: productId,
            quantity: quantity,
          }
        })
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            price: totalPrice,
          }
        })

        return res.status(200).json(order)

      } else {
        const order = await prisma.order.create({
          data: {
            price: parseFloat(price),
            customerId: parseInt(user.id),
            shipingPrice: 0,
            totalPrice: 0,
            status: status
          }
        })

        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: productId,
            quantity: quantity,

          },

        })
        return res.status(200).json(order)
      }

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    return res.status(404).json({ message: 'User not found please login first' })

  }

};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (user.userType === UserType.CUSTOMER) {

    try {

      const orders = await prisma.order.findMany({ where: { customerId: parseInt(user.id) }, include: { OrderItem: { include: { product: true } } } })

      let orderData: Array<any> = []
      for (const order of orders) {
        for (const item of order.OrderItem) {
          orderData.push({ ...item.product, orderId: order.id, orderItemId: item.id, quantity: item.quantity, totalPrice: order.price, status: order.status })
        }
      }

      return res.status(200).json(orderData)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    return res.status(404).json({ message: 'User not found please login first' })

  }

};

export const getOrderPending = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (user.userType === UserType.CUSTOMER) {

    try {

      const orders = await prisma.order.findMany({ where: { customerId: parseInt(user.id) }, include: { OrderItem: { include: { product: true } } } })

      const pendingOrder = orders.find((order) => {
        if (order.status === Status.PENDING) {
          return order
        }
      })
      return res.status(200).json(pendingOrder)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    return res.status(404).json({ message: 'User not found please login first' })

  }

};

export const getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  try {

    const orders = await prisma.order.findMany({ where: { customerId: parseInt(user.id) }, include: { OrderItem: { include: { product: true } } } })

    let orderData: Array<any> = []
    for (const order of orders) {
      for (const item of order.OrderItem) {
        if (order.id === item.orderId) {
          orderData.push({ orderId: item.orderId, picture: item.product.picture })
        }
      }
    }
    let pictures: Array<any> = []

    for (const order of orders) {
      for (const data of orderData) {
        if (data.orderId === order.id) {
          for (const picture of data.picture) {
            pictures.push({ picture: picture });
          }
        }
      }
    }

    return res.status(200).json({ orders, pictures });

  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'Something went wrong' })
  }

};


export const deleteOrderItem = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  const { itemId } = req.params

  if (user.userType === UserType.CUSTOMER) {

    try {

      const orderItem = await prisma.orderItem.delete({ where: { id: parseInt(itemId) } })

      const orderItems = await prisma.orderItem.findMany({ where: { orderId: orderItem.orderId } })
      if (!orderItems.length) {
        const order = await prisma.order.delete({ where: { id: orderItem.orderId } })
      }
      return res.status(200).json({ success: true })

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }

};

export const getAllProductTags = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  try {
    const products = await prisma.product.findMany()
    let tags: Array<string> = []
    for (const product of products) {
      const tag = JSON.parse(JSON.stringify(product.tag))
      tags.push(...tag)
    }
    const allTags = tags.map((tag) => tag.trim())
    const uniqueTags = [...new Set(allTags)]
    return res.status(200).json(uniqueTags);

  } catch (error) {
    console.log('error', error);
    return res.status(500).json(error);
  }
}

export const getProductWithTag = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  const { tag } = req.params
  
  try {
    const products = await prisma.product.findMany({include: {vender: {include: {User: true }}}})
    const filterProducts = products.filter((product) => {
      const tags = JSON.parse(JSON.stringify(product.tag))
      return tags.includes(tag)
    } )
    return res.status(200).json(filterProducts);

  } catch (error) {
    console.log('error', error);
    return res.status(500).json(error);
  }
}


export const changeOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user
  const { orderStatus, orderId } = req.body
 
    try {

      const orders = await prisma.order.findUnique({ where: { id: parseInt(orderId) } })

      if (orders) {
        const order = await prisma.order.update({ 
          where: { id: orders.id },
          data: {
            status: orderStatus
          }

         })
      }
      return res.status(200).json({ success: true })

    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'Something went wrong' })
    }
  

};
