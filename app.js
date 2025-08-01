require('dotenv').config();
const express = require('express')
const router = require('./routers/router')
const app = express()
const port = 3000
const session = require('express-session')


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

const PORT = process.env.PORT || 8080; // Gunakan variabel env, atau fallback ke 8080
const EMAIL_USER = process.env.EMAIL_USER;
// const JWT_SECRET = process.env.JWT_SECRET;

console.log(`Aplikasi berjalan di port: ${PORT}`);
console.log(`Email user untuk nodemailer: ${EMAIL_USER}`); // Hati-hati jangan log informasi sensitif di produksi!


app.use(session({
  secret: 'pace 2:12', //utk ngamanin session kita
  resave: false,  //pasang false krn cuman save pas ada changes
  saveUninitialized: false, //
  cookie: { 
    secure: false,
    sameSite: true
   } 
}))
app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
