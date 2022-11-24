import express from 'express'
// require('dotenv').config()
import cors from 'cors'
import { services } from './src/services/index'
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
const prisma = new PrismaClient();

app.use(morgan('dev', {
  skip: function (req: any, res: any) { return res.statusCode < 400 }
}))
app.use(morgan('dev', {
  skip: function (req: any, res: any) { return res.statusCode >= 400 }
}))
// Middlewares
app.use('/api', services);

const port = 8000;

var server = app.listen(port, () =>
  console.log(`Express app listening on localhost:${port}`)
);

var io = require("socket.io")(server)

io.on("connection", (socket: any) => {
  socket.on("connectionDetail", (userDetail: any) => {
    console.log('socket', userDetail);

    if (userDetail) {
      storeToken(userDetail);
    }
  });

  socket.on("receiver_message", async (senderId: any, receiverId: any, message: string) => {
   
    console.log('user connection', senderId, receiverId, message);
    let roomId = "0"

    if (senderId > receiverId) {
      roomId = receiverId.toString()
      roomId = `${roomId}${senderId}`
    } else {
      roomId = senderId
      roomId = `${roomId}${receiverId}`
    }
    
    if (senderId && receiverId) {

      await prisma.chat.create({
        data: {
          senderId: senderId,
          receiverId: receiverId,
          roomId: roomId,
          message: message,
          userId: receiverId
        }
      })
    }

    const userConnection = await prisma.userChatConnection.findUnique({
      where: {
        userId: receiverId,
      }
    })
    console.log('user connection', userConnection);
    
    if (userConnection) {
      socket.broadcast.to(userConnection.socketId).emit("sender_message", userConnection.userId, senderId, message);
    }
  })

})

const storeToken = async (userDetail: any) => {

  const userConnectionDetails = await prisma.userChatConnection.findFirst({
    where: {userId: userDetail.userId}
  })
  if (userConnectionDetails) {
    await prisma.userChatConnection.update({
      where: {userId: userDetail.userId},
      data: {
        socketId: userDetail.socketId,
      }
    })
  } else {
    await prisma.userChatConnection.create({
      data: {
        socketId: userDetail.socketId,
        userId: userDetail.userId,
      }
    })
  }
}
