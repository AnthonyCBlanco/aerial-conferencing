const router = require('express').Router();
const userRoutes = require('./user-routes');
const friendRoutes = require('./friend-routes');
const forgetPasswordRoutes = require('./forgetpassword-routes')

router.use('/users', userRoutes);
router.use('/friends', friendRoutes);
router.use('/forgetpassword', forgetPasswordRoutes);
module.exports = router;

