import express from 'express';

import * as controller from './controller';
const jwt = require('express-jwt')
import { secret_key } from '../../../secret'

export const userRouter = express.Router();

userRouter.route('/').get(jwt(secret_key), controller.getUsers);
userRouter.route('/edit').patch(jwt(secret_key), controller.editUser);
userRouter.route('/status').patch(jwt(secret_key), controller.changeUserStatus);
userRouter.route('/product').post(jwt(secret_key), controller.addProduct);
userRouter.route('/product').get(jwt(secret_key), controller.getUserProduct);
userRouter.route('/product').patch(jwt(secret_key), controller.editProduct);
userRouter.route('/allProduct').get(jwt(secret_key), controller.getAllProduct);
userRouter.route('/follow').post(jwt(secret_key), controller.followPRoduct);
userRouter.route('/follow').get(jwt(secret_key), controller.getFollowProduct);
userRouter.route('/favorite').post(jwt(secret_key), controller.favoriteProduct);
userRouter.route('/favorite').get(jwt(secret_key), controller.getFavoriteProduct);
userRouter.route('/category').get(jwt(secret_key), controller.getCategory);
userRouter.route('/order').post(jwt(secret_key), controller.addOrder);
userRouter.route('/order').get(jwt(secret_key), controller.getOrder);
userRouter.route('/order/:orderId').delete(jwt(secret_key), controller.deleteOrder);
userRouter.route('/product/:productId').get(jwt(secret_key), controller.getSingleProduct);


