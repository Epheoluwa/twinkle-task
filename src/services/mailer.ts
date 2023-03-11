import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

const mailer = async(email:String, otp:number) =>{
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD
    },
  });

  const details = {
    from: '"Twinkle Tets 👻" <solomonepheoluwa@gmail.com>', // sender address
    to: `${email}`, // list of receivers
    subject: "Twinkle OTP ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>This is your OTP: ${otp} </b>` // html body
  }
  // send mail with defined transport object
  let info = await transporter.sendMail(details, (err)=>{
    if(err)
    {
        console.log("ERROR: ", err);
    }else{
        console.log("Email Sent");
        
    }
  });

}

export default mailer;
