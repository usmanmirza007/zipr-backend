import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { PrismaClient, UserType } from '@prisma/client';
var bcrypt = require('bcryptjs');
var path = require("path");
const jwt = require('jsonwebtoken')
import { secret_key } from './../../../secret'

const prisma = new PrismaClient();

export const customerSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, type } = req.body;

  let usersType: UserType = type

  if (UserType.CUSTOMER == type) {
    usersType = UserType.CUSTOMER
  }
  if (!firstName || !lastName || !email || !password || !type) {

    return res.status(400).send({ message: 'Incomplete parameter' });
  } else {

    const exsitingUser = await prisma.user.findUnique({ where: { email: email } })

    if (exsitingUser) {
      return res.status(409).json({ message: 'User with email is already register' })
    } else {

      try {

        var hash = bcrypt.hashSync(password, 8);
        const customer = await prisma.customer.create({
          data: {
            isActive: true,
          }
        })
        const vender = await prisma.vender.create({
          data: {
            isActive: false,
          }
        })
        if (customer.id && vender.id) {
          
        const user = await prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            userType: usersType,
            email: email,
            password: hash,
            venderId: vender.id,
            customerId: customer.id
          }
        })

        const data = await jwt.sign({
          username: email,
          userType: user.userType,
          id: user.id,
        }, secret_key.secret, {
          expiresIn: '4h',
          algorithm: secret_key.algorithms[0]
        });
        return res.status(200).json({ token: data, type: UserType.CUSTOMER })
      }

      } catch (error) {
        console.log('error', error);
        
        return res.status(500).json({ message: 'Something went wrong' })
      }
    }
  }

};

export const vendorSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, type, vendorName } = req.body;
  let usersType: UserType = type
  
  if (UserType.VENDER == type) {
    usersType = UserType.VENDER
  }
  if (!firstName || !lastName || !email || !password || !type) {
    return res.status(400).send({ message: 'Incomplete parameter' });
  } else {

    const exsitingUser = await prisma.user.findUnique({ where: { email: email } })

    if (exsitingUser) {
      return res.status(409).json({ message: 'User with email is already register' })
    } else {

      try {

        var hash = bcrypt.hashSync(password, 8);
        const customer = await prisma.customer.create({
          data: {
            isActive: false,
          }
        })
        
        const vender = await prisma.vender.create({
          data: {
            isActive: true,
          }
        })

        if (customer.id && vender.id) {
          
        const user = await prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            userType: usersType,
            email: email,
            password: hash,
            venderId: vender.id,
            customerId: customer.id
          }
        })
        
        const data = await jwt.sign({
          username: email,
          userType: user.userType,
          id: user.id,
        }, secret_key.secret, {
          expiresIn: '4h',
          algorithm: secret_key.algorithms[0]
        });
        return res.status(200).json({ token: data, type: UserType.VENDER })
      }

      } catch (error) {
        console.log('err', error);
        
        return res.status(500).json({ message: 'Something went wrong' })
      }
    }
  }

};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Incomplete parameter' });
  } else {
    const user = await prisma.user.findUnique({ where: { email: email }, include: {customer: true, vender: true} })

    if (user?.customer.isActive) {
      // customer user login

      let matched = bcrypt.compareSync(password, user.password);

      if (matched) {
        try {
          const customerData = user;

          // delete customerData.password;
          const data = await jwt.sign({
            username: email,
            userType: user.userType,
            id: customerData.id,
          }, secret_key.secret, {
            expiresIn: '4h',
            algorithm: secret_key.algorithms[0]
          });
          return res.status(200).json({ token: data, type: UserType.CUSTOMER })

        } catch (error) {
          return res.status(500).json({ message: 'Something went wrong' })
        }
      } else {
        return res.status(401).json({ message: 'Incorrect credentials' })
      }
    } else if (user?.vender?.isActive) {
      // vendor user login
      let matched = bcrypt.compareSync(password, user.password);

      if (matched) {
        try {
          const vendorData = user;

          // delete vendorData.password;
          const data = await jwt.sign({
            username: email,
            userType: user.userType,
            id: vendorData.id,
          }, secret_key.secret, {
            expiresIn: '4h',
            algorithm: secret_key.algorithms[0]
          });
          return res.status(200).json({ token: data, type: UserType.VENDER })
        } catch (error) {
          return res.status(500).json({ message: 'Something went wrong' })
        }
      } else {
        return res.status(401).json({ message: 'Incorrect credentials' })
      }
    } else {

      return res.status(404).json({ message: 'User not found' })
    }

  };
}
