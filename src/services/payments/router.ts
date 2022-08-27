import express from 'express';
import { secret_key } from '../../../secret';
import * as controller from './controller';
const jwt = require('express-jwt')

export const paymentRouter = express.Router();

paymentRouter.route('/add').post(jwt(secret_key),controller.addPayment);

