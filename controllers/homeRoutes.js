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

router.get('/forgetpassword', async (req, res) => {
    // if (req.session.loggedIn) {
    //     res.redirect('/');
    //     return;
    //   } else {}
        res.render('forgetpassword');

    
});


router.get('/room', async (req, res) => {
    res.render('room', { loggedIn: req.session.loggedIn })

})

module.exports = router;