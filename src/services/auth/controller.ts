import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { PrismaClient, UserType } from '@prisma/client';
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
var bcrypt = require('bcryptjs');
var path = require("path");
const jwt = require('jsonwebtoken')
import { secret_key } from './../../../secret'

const prisma = new PrismaClient();

export const customerSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, type } = req.body;
  console.log('FOFO', req.body);

  let usersType: UserType = type

  if (UserType.CUSTOMER == type) {
    usersType = UserType.CUSTOMER
  }
  if (!firstName || !lastName || !email || !password || !type) {

    return res.status(400).send({ message: 'Incomplete parameter' });
  } else {

    const exsitingUser = await prisma.customer.findUnique({ where: { email: email } })

    if (exsitingUser) {
      return res.status(409).json({ message: 'User with email is already register' })
    } else {

      try {

        var hash = bcrypt.hashSync(password, 8);
        const user = await prisma.customer.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            userType: usersType,
            email: email,
            password: hash,
          }
        })
        return res.status(200).json({ success: true })
      } catch (error) {
        return res.status(500).json({ message: 'something went wrong' })
      }
    }
  }

};

export const vendorSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, type, vendorName } = req.body;
  let usersType: UserType = type
  console.log('fofo', req.body);
  
  if (UserType.VENDOR == type) {
    usersType = UserType.VENDOR
  }
  if (!firstName || !lastName || !email || !password || !type || !vendorName) {

    return res.status(400).send({ message: 'Incomplete parameter' });
  } else {

    const exsitingUser = await prisma.vendor.findUnique({ where: { email: email } })

    if (exsitingUser) {
      return res.status(409).json({ message: 'User with email is already register' })
    } else {

      try {

        var hash = bcrypt.hashSync(password, 8);
        const user = await prisma.vendor.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            userType: usersType,
            email: email,
            vendorName: vendorName,
            password: hash,
          }
        })
        return res.status(200).json({ success: true })
      } catch (error) {
        return res.status(500).json({ message: 'something went wrong' })
      }
    }
  }

};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Incomplete parameter' });
  } else {
    const customer = await prisma.customer.findUnique({ where: { email: email } })
    const vendor = await prisma.vendor.findUnique({ where: { email: email } })
    console.log('customerss', customer);

    if (customer) {
      // customer user login
      console.log('customer');

      let matched = bcrypt.compareSync(password, customer.password);

      if (matched) {
        try {
          const customerData = customer;

          // delete customerData.password;
          const data = await jwt.sign({
            username: email,
            userType: customer.userType,
            id: customerData.id,
          }, secret_key.secret, {
            expiresIn: '4h',
            algorithm: secret_key.algorithms[0]
          });
          return res.status(200).json({ token: data, type: UserType.CUSTOMER })

        } catch (error) {
          return res.status(500).json({ message: 'something went wrong' })
        }
      } else {
        return res.status(401).json({ message: 'Incorrect credentials' })
      }
    } else if (vendor) {
      // vendor user login
      let matched = bcrypt.compareSync(password, vendor.password);

      if (matched) {
        try {
          const vendorData = vendor;

          // delete vendorData.password;
          const data = await jwt.sign({
            username: email,
            userType: vendor.userType,
            id: vendorData.id,
          }, secret_key.secret, {
            expiresIn: '4h',
            algorithm: secret_key.algorithms[0]
          });
          return res.status(200).json({ token: data, type: UserType.VENDOR })
        } catch (error) {
          return res.status(500).json({ message: 'something went wrong' })
        }
      } else {
        return res.status(401).json({ message: 'Incorrect credentials' })
      }
    } else {

      return res.status(404).json({ message: 'User not found' })
    }

  };
}
