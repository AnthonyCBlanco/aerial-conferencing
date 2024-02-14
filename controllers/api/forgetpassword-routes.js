const router = require('express').Router();
const { User, ResetToken } = require('../../models');
require('dotenv').config();
const { emailHandler } = require('../../utils/resetPassword')
const { generateRandomCode } = require('../../utils/randomcode')

router.post('/', async (req, res) => {
   const email = req.body.email
   if(!email) res.status(400).json("Please Enter A Email")

   const userData = await User.findOne({where: {email: email}, attributes: {exclude: ['password']}})

   if(!userData) res.status(404).json('can not find user with that email')

   const token = generateRandomCode(8)
   
   const tokenData = await ResetToken.create({
      email: email,
      token: token
   })

   emailHandler(email, token)
   
  });

  module.exports = router;
