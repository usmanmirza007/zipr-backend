const express = require('express')
import { userRouter } from './user'
import { authRouter } from './auth'


export const services = express.Router()

services.use('/auth', authRouter)
services.use('/users', userRouter)