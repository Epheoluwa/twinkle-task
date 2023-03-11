import { Request, Response, NextFunction } from 'express';
import db from '../model/database';
import { MysqlError } from 'mysql';
import bcrypt from 'bcrypt';
import mailer from '../services/mailer';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotenv from 'dotenv'
import Cookies from 'js-cookie'
dotenv.config();

function generateOtp(min: number, max: number) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}
export const register = (req: Request, res: Response) => {
    // console.log(req.body)
    const { name, email, password, confirmpassword } = req.body;

    db.query('SELECT email from users WHERE email = ?', [email], async (error: MysqlError | null, results: any) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'Email is already in use'
            })
        } else if (password !== confirmpassword) {
            return res.render('register', {
                message: "Password doesn't match"
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error: MysqlError | null, results: any) => {
            if (error) {
                console.log(error)
            } else {
                let otp = generateOtp(10, 1000000)
                req.session.otpValue = otp;
                mailer(email, otp)
                // var emails = encodeURIComponent(`${email}`);
                // res.redirect('/verify?email=' + emails);
                res.render('verify', {
                    email: email
                })
            }
        })

    });
}

export const verify = (req: Request, res: Response) => {
    const { otp, email } = req.body;
    const sessionotp = req.session['otpValue']
    console.log('OTP FROM VERIFY: ', sessionotp);
    if (sessionotp == otp) {
        db.query("UPDATE users SET verified = ? WHERE email = ?", [1, email], (err: MysqlError | null) => {
            if (err) {
                console.log(err);
            }

            // res.render('verify', {
            //     message: 'OTP is verified'
            // })
            setTimeout(() => {
                const string = encodeURIComponent('OTP VERIFIED, PLEASE LOGIN NOW')
                res.redirect('/login?success=' + string)
            }, 2000);
        })

    } else {

        // return res.render('verify', {
        //     message: 'You have enntered a wrong OTP'
        // })
        console.log('entered the wrong otp');

    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        db.query('SELECT * FROM users WHERE verified = ? AND email = ?', [1, email], async (err: MysqlError | null, results: any) => {
            if (!results || !await bcrypt.compare(password, results[0].password)) {
                res.render('login', {
                    message: "Email or Passowrd is not correct",
                    success: ''
                })
            } else {
                const id = results[0].id;
                const tokenSecret:string = 'twinkelJWTSECRETTESTINGTESTINGNOW'
                const token = jwt.sign({ id }, tokenSecret, { expiresIn: process.env.JWT_EXPIRES_IN });

                // console.log("the token: ", token);

                // const cookieOptions = {
                //     expires: 7,
                //     httpOnly: true
                // }

                req.session.setUserToken = token;
                // res.cookie('savedUser', token, cookieOptions)
                //  Cookies.set('savedUser', token, cookieOptions)
                // console.log('set: ', setting);
                res.redirect('/');
                // console.log('USER LOGGED IN SUCCESSFULLY');
                
            }
        })
    } catch (err) {
        console.log(err);
    }

}

export const isLoggedIn = async(req:Request, res:Response, next:NextFunction) =>{
    console.log(req.session['setUserToken'])
    console.log('cookids: ', Cookies.get('setUserToken'))
    
if (req.session['setUserToken']) {
    try{
        //verofy the token
        const decoded = await promisify(jwt.verify)(req.cookies.savedUser);
        const tokenSecret:string = 'twinkelJWTSECRETTESTINGTESTINGNOW'
        console.log('isLoggedIn decoded: ', decoded);

        //verify if user exist
        db.query('SELECT * FROM users WHERE id = ?', [decoded], (err:MysqlError | null, results:any)=>{
            if (!results) {
                return next();
            }
            return next()
        })
        

    }catch (err){
        console.log(err);
        return next()
    }
}else{
    next()
}
}