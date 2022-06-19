import express from 'express';
import * as controller from './controller';

export const authRouter = express.Router();

/** POST /api/auth */
authRouter.route('/login').post(controller.login);
authRouter.route('/customerSignUp').post(controller.customerSignup);
authRouter.route('/vendorSignUp').post(controller.vendorSignup);

