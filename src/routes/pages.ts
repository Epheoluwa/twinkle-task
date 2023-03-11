import express,{ Request, Response} from 'express';
import { isLoggedIn } from '../controllers/authController';

 const router = express.Router()

router.get('/', isLoggedIn, (req:Request, res:Response)=>{    
    res.render("index")
})

router.get('/login',(req:Request, res:Response)=>{
    var successP = req.query.success
    res.render("login", {
        success: successP,
        message: ""
    })
})

router.get('/register',(req:Request, res:Response)=>{
    res.render("register", {
        message: ""
    })
})
router.get('/verify',(req:Request, res:Response)=>{
    var email = req.query.valid;
    res.render("verify", {
        email: email,
    })
})

export default router