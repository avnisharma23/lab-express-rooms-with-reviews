const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User.model')
const saltRounds = 10;



/* GET sigup page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup',async(req,res) => {
    
    const { username,email,password,fullName } = req.body

    if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
    }
    const passwordHash = await bcrypt.hash(password,saltRounds);
    User.create({username,email,password : passwordHash,fullName})
        .then((newUser) => {
            
            req.session.currentUser = {username: newUser.username};

            console.log('After create',req.session.currentUser);
            res.redirect('/auth/profile')
        })
        .catch(error => console.log(error))
    
})

// For login page
router.get('/login',(req,res) => {
    console.log('session ID',req.session.id)
    res.render('auth/login');
})

router.post('/login',(req,res) => {
    console.log('SESSION =====> ', req.session);
    const { username,email,password,fullName } = req.body;

    //Data validation check 
  if (email === '' || password === '') 
  {
    res.render('auth/login', {
      errorMessage: 'Please enter username, email and password to login.'
    });
    return;
  }

  User.findOne({ email })
  .then(user => { // --> { username: '', email: '', password: ''} || null
    console.log('user', user)
  if (!user) 
  { // if user is not found in the DB
    res.render('auth/login', { errorMessage: 'Username is not registered. Try with other email.' });
    return;
  } 
  else if (bcrypt.compareSync(password, user.password)) 
  { // if password is correct
    
    const { username,email,password,fullname } = user;
    req.session.currentUser = { username,email }; // creating the property currentUser  
    res.redirect('/auth/profile')
    
  } else { // if password is incorect
    res.render('auth/login', { errorMessage: 'Incorrect password.' });
  }
})
.catch(error => console.log(error));

})

router.get('/profile', (req, res) => {
    console.log(req.session.username)
    res.render('auth/profile', req.session.currentUser)
})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) console.log(err);
      res.redirect('/');
    });
  });

module.exports = router;