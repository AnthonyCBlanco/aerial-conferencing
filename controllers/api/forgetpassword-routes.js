const router = require('express').Router();
const { User, ResetToken } = require('../../models');
require('dotenv').config();
const { emailHandler } = require('../../utils/nodemailconfig')
const { generateRandomCode } = require('../../utils/randomcode')

router.post('/', async (req, res) => {
   const email = req.body.email
   if(!email) return

   const userData = await User.findOne({where: {email: email}, attributes: {exclude: ['password']}})

   if(!userData) return

   const token = generateRandomCode(8)
   
   const tokenData = await ResetToken.create({
      email: email,
      token: token
   })

   emailHandler(email, token)
   
  });

  module.exports = router;
