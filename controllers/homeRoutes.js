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
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
        res.render('forgetpassword');
});

// router.get('/profile', async (req, res) => {
//     if (!req.session.loggedIn) {
//         res.redirect('/login');
//         return;
//     }
//     res.render('profile', { loggedIn: req.session.loggedIn } )
//     });

router.get('/room', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/login');
        return;
    }
    res.render('room', { loggedIn: req.session.loggedIn })

})

router.get('/johnathan', async (req, res) => {
    res.render('secret')
})

module.exports = router;