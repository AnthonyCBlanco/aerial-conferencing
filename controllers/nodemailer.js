const nodemailer = require("nodemailer");
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'gamil',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "wilsonnnnn820324@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Aerial Conferencing" <wilsonnnnn820324@gmail.com>', // sender address
    to: "wilsoncheng0324@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world2?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);