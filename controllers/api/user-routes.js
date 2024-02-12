const router = require('express').Router();
const { User, Friend } = require('../../models');

// Get all user
router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll({
      include: [{ model: Friend}],
    });
    res.status(200).json(userData);
  }catch (err){
    res.status(404).json(err);
  }
});


// CREATE new user
router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    req.session.save(() => {
      req.session.loggedIn = false;

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    req.session.userId = dbUserData.id;

    req.session.save(() => {
      req.session.loggedIn = true;

      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get('/test-session', (req, res) => {
  console.log('Session ID:', req.sessionID);
  console.log('User ID from session:', req.session.userId);
  res.send('Check the console for session information.');
});

// Get friends for the logged-in user
router.get('/friends', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized - User not logged in' });
    }

    // Get the current logged-in user's ID from the session
    const userId = req.session.userId;

    // Fetch the user and their associated friends
    const userData = await User.findByPk(userId, {
      include: [{ model: Friend }],
    });

    // Extract the friend data from the user object
    const friends = userData ? userData.friends : [];

    // Send the friend data as a JSON response
    res.status(200).json({ friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
