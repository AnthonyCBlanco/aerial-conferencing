const router = require('express').Router();
const { User, ResetToken } = require('../../models');
require('dotenv').config();
const { emailHandler } = require('../../utils/nodemailconfig')
const { generateRandomCode } = require('../../utils/randomcode')

router.post('/', async (req, res) => {
   const email = req.body.email
   if(!email) return

   const userData = await User.findOne({where: {email: email}, attributes: {exclude: ['password']}})
   console.log(userData.id)

   if(!userData) return

   const token = generateRandomCode(8)
   
   const tokenData = await ResetToken.create({
      email: email,
      token: token
   })

   req.session.save(()=> {
      req.session.id = userData.id
  }) 

   emailHandler(email, token)
   res.json(userData.id)
  });

router.get('/:code', async (req, res) => {
   const resetcode = req.params.code

   const tokenData = await ResetToken.findOne({where: {token: resetcode}})

   res.status(200).json(tokenData)
})

router.put('/setpassword', async (req, res) => {
   try{
   const newpassword = req.body.password
   const userID = req.body.id
   
      const [affectedRows] = await User.update({ password: newpassword }, {
         where: {
            id: userID
         },
         individualHooks: true,
      })
      console.log(affectedRows)

      if(affectedRows > 0) {
         res.status(200).end()
      }else{
         res.status(500).end()
      }
   // await User.update(   
   //    { password: newpassword }, 
   //    { where:  { id: userID } }
   //    )

   // res.status(200).json("Password Updated")
   }catch(err){
      console.log(err)
   }  
})

module.exports = router;
