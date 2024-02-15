const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "aerialdevteam85@gmail.com",
      pass: process.env.APP_PASSWORD,
    },
});

async function emailHandler(email, token) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'aerialdevteam85@gmail.com', // sender address
      to: email,
      subject: "Password Reset", // Subject line
      text: "Password Reset", // plain text body
      html: `<p>You Code Is ${token}</p>`, // html body
    });
    
    console.log("Message sent: %s", info.messageId);
  }

module.exports = { emailHandler }