import express from 'express';
import { secret_key } from '../../../secret';
import * as controller from './controller';
const jwt = require('express-jwt')

export const chatRouter = express.Router();

chatRouter.route('/list').get(jwt(secret_key),controller.getUserChatList);
chatRouter.route('/signleUserChat/:roomId').get(jwt(secret_key),controller.getSignleUserChat);
chatRouter.route('/single/:userId').get(jwt(secret_key), controller.getSingleUser);
