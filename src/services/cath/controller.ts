import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSignleUserChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id
  const { roomId } = req.params

  try {

    const singleUserChat = await prisma.chat.findMany({
      where: { roomId: roomId },
    })
    return res.status(200).json(singleUserChat)

  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ error: "Some error occurred" })

  }
};

export const getUserChatList = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id
  
  try {

    const userChats = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ],
      },
      distinct: ["roomId"],
      orderBy: {createdAt: 'desc'},
    })

    const userIds: Array<{id: number}> = []

    let chatUserId: number | null = null

    for (const userChat of userChats) {
      if (userChat.receiverId == userId) {
        chatUserId = userChat.senderId
      } else {
        chatUserId = userChat.receiverId
      }
      userIds.push({id: chatUserId})
    }

    const getUser = await prisma.user.findMany({
      where: {
        OR: userIds,
      }
    })
    
    const chatWithUserDetails = userChats.map((chat) => ({
      ...chat,
      ['user']: getUser.find((user) => user.id == chat.senderId || user.id == chat.receiverId)
    }))

    return res.status(200).json(chatWithUserDetails)

  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ error: "Some error occurred" })
  }
};

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } })

    return res.status(200).json(user)

  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'Something went wrong' })
  }

};