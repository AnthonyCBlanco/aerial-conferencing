const router = require('express').Router();
const { User, Friend } = require('../../models');



router.post('/', async (req, res) => {
  try {
    const username = req.body.username;

    // Check if userId is set
    if (!req.session.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Print the user ID
    console.log(`Logged-in User ID: ${req.session.userId}`);

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use req.session.userId to get the current logged-in user's ID
    const dbFriendData = await Friend.create({
      username,
      user_id: req.session.userId,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      const currentUser = req.session.userId;
      console.log(`Current user_id ${currentUser}`);
      res.status(200).json(dbFriendData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
