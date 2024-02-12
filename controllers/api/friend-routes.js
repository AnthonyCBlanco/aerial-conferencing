const router = require('express').Router();
const { User, Friend } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const username = req.body.username;
    const currentUser = req.session.userId;
    // Check if userId is set
    if (!currentUser) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log(`Logged-in User ID: ${currentUser}`);

    // Retrieve the current user's username from the database
    const currentUserData = await User.findByPk(currentUser, { attributes: ['username'] });
    const currentUsername = currentUserData ? currentUserData.username : null;

    // Check if the current user is adding themselves
    if (currentUsername === username) {
      return res.status(400).json({ message: 'Cannot add yourself as a friend' });
    }

    // Check if the friend is already in the friend list
    const existingFriend = await Friend.findOne({
      where: {
        username,
        user_id: currentUser,
      },
    });

    if (existingFriend) {
      return res.status(400).json({ message: 'Friend is already in your friend list' });
    }


    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const dbFriendData = await Friend.create({
      username,
      user_id: currentUser,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      
      console.log(`Current user_id ${currentUser}`);
      res.status(200).json(dbFriendData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/remove', async (req, res) => {
  try {
    const username = req.body.username;
    const currentUser = req.session.userId;

    // Check if userId is set
    if (!currentUser) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if the friend is in the friend list
    const existingFriend = await Friend.findOne({
      where: {
        username,
        user_id: currentUser,
      },
    });

    if (!existingFriend) {
      return res.status(400).json({ message: 'Friend not found in your friend list' });
    }

    // Remove the friend from the friend list
    await existingFriend.destroy();

    req.session.save(() => {
      req.session.loggedIn = true;
      res.status(200).json({ message: 'Friend removed successfully' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
