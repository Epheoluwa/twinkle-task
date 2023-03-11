import express, { Request, Response } from 'express';
import {register, verify, login} from '../controllers/authController'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/verify', verify)
authRouter.post('/login', login)




export default authRouter