import mysql ,{Connection } from 'mysql';
import dotenv from 'dotenv'
dotenv.config();

 const db:Connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
    // host: 'localhost',
    // user: "root",
    // password: '',
    // database: "twinkle_test"
})

export default db