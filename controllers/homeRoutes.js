const router = require('express').Router();

router.get('/', async (req, res) => {
    
    res.render('homepage', {loggedIn: req.session.loggedIn});
});

router.get('/login', async (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      } else {
        res.render('login');
      }
    
});

router.get('/signup', async (req,res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    } else {
        res.render('signup');
    }
    
})

router.get('/room', async (req, res) => {
    if (!req.session.loggedIn)  {
        res.redirect('/login')
    } else{
        res.render('room')
    }
})

module.exports = router;