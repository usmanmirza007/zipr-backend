const express = require('express')
import { userRouter } from './user'
import { authRouter } from './auth'
import { paymentRouter } from './payments'
import { chatRouter } from './cath/router'


export const services = express.Router()

services.use('/auth', authRouter)
services.use('/users', userRouter)
services.use('/payments', paymentRouter)
services.use('/chat', chatRouter)