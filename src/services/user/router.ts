import express from 'express';

import * as controller from './controller';
const jwt = require('express-jwt')
import { secret_key } from '../../../secret'

export const userRouter = express.Router();

userRouter.route('/').get(jwt(secret_key), controller.getUsers);
userRouter.route('/edit').patch(jwt(secret_key), controller.editUser);
userRouter.route('/order').post(jwt(secret_key), controller.addOrder);
userRouter.route('/order').get(jwt(secret_key), controller.getUserOrders);
userRouter.route('/order').patch(jwt(secret_key), controller.editOrder);
userRouter.route('/allOrder').get(jwt(secret_key), controller.getAllOrders);
userRouter.route('/follow').post(jwt(secret_key), controller.orderFollow);
userRouter.route('/follow').get(jwt(secret_key), controller.getOrderFollow);
userRouter.route('/favorite').post(jwt(secret_key), controller.orderFavorite);
userRouter.route('/favorite').get(jwt(secret_key), controller.getOrderFavorite);
userRouter.route('/order/:orderId').get(jwt(secret_key), controller.getSingleOrder);


