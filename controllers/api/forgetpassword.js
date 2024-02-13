const router = require('express').Router();
const { User, Friend } = require('../../models');
const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gamil',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // TODO: replace user
    user: "wilsonnnnn820324@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

router.post('/forgetpassword', async (req, res) => {
   
  });


async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: //'"Aerial Conferencing" Sender email', // sender address
    to: //, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world2?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
 
}

main().catch(console.error);