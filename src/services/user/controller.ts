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

  if (user.userType === UserType.VENDOR) {

    try {
      const order = await prisma.order.create({
        data: {
          name: name,
          description: description,
          price: price,
          location: location,
          picture: picture
        }
      })
      
      for (const tag of tags) {
        
        await prisma.tag.create({
          data: {
            tag1: tag.tag1,
            tag2: tag.tag2,
            tag3: tag.tag3,
            tag4: tag.tag4,
            tag5: tag.tag5,
            orderId: order.id
          }
        })
      }
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
            picture: picture
          }
        })
        for (const tag of tags) {

          await prisma.tag.updateMany({
            where: { orderId: existingOrder.id },
            data: {
              tag1: tag.tag1,
              tag2: tag.tag2,
              tag3: tag.tag3,
              tag4: tag.tag4,
              tag5: tag.tag5,
            }
          })
        }

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

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (user.userType === UserType.VENDOR) {

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




// export const createTournament = async (req: Request, res: Response, next: NextFunction) => {
//   const { title, visibility, startDate, endDate, registrationDate, fee } = req.body;
//   const userId = (req as any).user.id

//   var tournamentVisibility: any
//   if (visibility == Visible.PUBLIC) {
//     tournamentVisibility = Visible.PUBLIC
//   }

//   if (visibility == Visible.PRIVATE) {
//     tournamentVisibility = Visible.PRIVATE
//   }

//   if (!title || !visibility || !startDate || !endDate || !registrationDate || !fee) {
//     return res.status(400).send({ error: 'Incomplete parameter' });
//   }

//   try {
//     const tournament = await prisma.tournament.create({
//       data: {
//         title: title,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         registrationDate: new Date(registrationDate),
//         userId: parseInt(userId),
//         fee: parseInt(fee),
//         visibility: tournamentVisibility
//       }
//     })

//     return res.status(200).json({})
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }

// };

// export const getAllTournament = async (req: Request, res: Response, next: NextFunction) => {
//   const userId = (req as any).user.id

//   try {
//     const tournament = await prisma.tournament.findMany({
//       where: {
//         userId: parseInt(userId)
//       },
//       include: { FollowTournament: { select: { userId: true } } }
//     })
//     if (tournament.length) {
//       return res.status(200).json(tournament)
//     }
//     else {
//       return res.status(404).json([])
//     }
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }
// };

// export const deleteTournament = async (req: Request, res: Response, next: NextFunction) => {
//   const userId = (req as any).user.id
//   const { tournamentId } = req.params

//   if (!tournamentId)
//     return res
//       .status(400)
//       .json({ error: 'Request should have tournamentId' });

//   try {

//     await prisma.tournament.delete({
//       where: {
//         id: parseInt(tournamentId)
//       }
//     })

//     return res.status(200).json({ success: true })
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }
// };

// export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
//   const { name, playerNumber } = req.body;
//   const userId = (req as any).user.id

//   if (!name || !playerNumber) {
//     return res.status(400).send({ error: 'Incomplete parameter' });
//   }

//   try {
//     const tournament = await prisma.team.create({
//       data: {
//         name: name,
//         userId: parseInt(userId),
//         playerNumber: parseInt(playerNumber),
//       }
//     })

//     return res.status(200).json({})
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }

// };

// export const createPlayer = async (req: Request, res: Response, next: NextFunction) => {
//   const { name } = req.body;
//   const userId = (req as any).user.id
//   const { teamId } = req.params

//   if (!name) {
//     return res.status(400).send({ error: 'Incomplete parameter' });
//   }

//   const exsitTeam = await prisma.team.findFirst({ where: { id: parseInt(teamId) } })
//   if (exsitTeam) {

//     try {
//       const tournament = await prisma.player.create({
//         data: {
//           name: name,
//           teamId: parseInt(teamId),
//         }
//       })

//       return res.status(200).json({})
//     } catch (error) {
//       console.log('err', error);
//       return res.status(500).json({ message: 'something went wrong' })
//     }
//   } else {
//     return res.status(404).json({ message: 'Team no found' })

//   }

// };

// export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
//   const userId = (req as any).user.id

//   try {
//     const team = await prisma.team.findMany({
//       where: {
//         userId: parseInt(userId)
//       }
//     })
//     if (team.length) {
//       return res.status(200).json(team)
//     }
//     else {
//       return res.status(404).json([])
//     }
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }
// };

// export const getAllTeam = async (req: Request, res: Response, next: NextFunction) => {
//   const userId = (req as any).user.id

//   try {
//     const allTeam = await prisma.team.findMany()

//     if (allTeam.length) {
//       return res.status(200).json(allTeam)
//     }
//     else {
//       return res.status(404).json([])
//     }
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }
// };

// export const getPlayer = async (req: Request, res: Response, next: NextFunction) => {
//   const userId = (req as any).user.id

//   try {
//     const teams = await prisma.team.findMany({
//       where: {
//         userId: parseInt(userId)
//       }
//     })

//     if (!teams.length) {
//       return res.status(404).json({ message: 'Player not found' })

//     }
//     const teamCondition: Array<{ teamId: number }> = []

//     for (const team of teams) {
//       teamCondition.push({ teamId: team.id })
//     }
//     const players = await prisma.player.findMany({
//       where: {
//         OR: teamCondition
//       }
//     })
//     if (players.length) {
//       return res.status(200).json(players)
//     }
//     else {
//       return res.status(404).json([])
//     }
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }
// };

// export const deletePlayer = async (req: Request, res: Response, next: NextFunction) => {
//   const userId = (req as any).user.id
//   const { playerId } = req.params

//   if (!playerId)
//     return res
//       .status(400)
//       .json({ error: 'Request should have playerId' });

//   try {

//     await prisma.player.delete({
//       where: {
//         id: parseInt(playerId)
//       }
//     })

//     return res.status(200).json({ success: true })
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }
// };

// export const createMatch = async (req: Request, res: Response, next: NextFunction) => {
//   const { firstTeamId, secondTeamId, startDate } = req.body;
//   const userId = (req as any).user.id

//   // if (!firstTeamId || !secondTeamId || !startDate) {
//   //   return res.status(400).send({ error: 'Incomplete parameter' });
//   // }

//   try {
//     const productsCount = await prisma.team.count();
//     const skip = Math.floor(Math.random() * productsCount);
//     const randomPick = (values: string[]) => {
//       const index = Math.floor(Math.random() * values.length);
//       return values[index];
//     }
//     const itemCount = await prisma.team.count();

//     const randomNumber = (min: number, max: number) => {
//       return Math.floor(Math.random() * (max - min + 1)) + min;
//     }

//     const orderBy = randomPick(['id', 'name', 'playerNumber', 'userId']);
//     const orderDir = randomPick([`asc`, `desc`]);

//     // console.log('yoyo', productsCount, skip);

//     const test = await prisma.team.findMany({
//       take: 2,
//       // skip: skip,
//       skip: randomNumber(0, itemCount - 1),
//       // orderBy: { [orderBy]: orderDir },
//       // orderBy: {
//       //     id: 'desc',
//       // },
//     });

//     // const match = await prisma.match.create({
//     //   data: {
//     //     userId: userId,
//     //     firstTeamId: parseInt(firstTeamId),
//     //     secondTeamId: parseInt(secondTeamId),
//     //     startDate: new Date(startDate)
//     //   }
//     // })

//     return res.status(200).json(test)
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }
// };

// export const getMatch = async (req: Request, res: Response, next: NextFunction) => {
//   const userId = (req as any).user.id

//   try {
//     const matchs = await prisma.match.findMany({
//       where: { userId: userId }
//     })

//     return res.status(200).json(matchs)
//   } catch (error) {
//     console.log('err', error);
//     return res.status(500).json({ message: 'something went wrong' })
//   }
// };


// export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
//   const { userId } = req.params;
//   try {
//     await prisma.user.delete({ where: { id: parseInt(userId) } })
//     return res.status(200).json();
//   } catch (error) {
//     return res.status(500).json({ message: 'something went wrong' })
//   }
// };
