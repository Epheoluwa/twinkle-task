import express,{Application} from 'express';
import router from './routes/pages';
import authRouter from './routes/auth';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';


const app: Application = express();

dotenv.config();

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, '../views'));

// // Set view engine as EJS
app.set('view engine', 'ejs');

//set the cookieparser
app.use(cookieParser())

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//session settings
declare module "express-session" {
    interface SessionData {
      otpValue: Number;
      setUserToken:String;
    }
  }
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({secret:'Twinkle test', resave:false, saveUninitialized: true, cookie:{maxAge: oneDay} }))

//setting routes
app.use('/', router)
app.use('/auth', authRouter)
 
app.listen(5000, () => console.log("Server is running"))