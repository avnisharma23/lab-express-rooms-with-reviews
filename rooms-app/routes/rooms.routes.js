const express = require('express');
const router = express.Router();

const User = require('../models/User.model')
const Room = require('../models/Room.model');
const { isLoggedIn, isLoggedOut} = require('../middleware/route-guard');
const { request } = require('express');

/* GET room page */
router.get('/room',isLoggedIn ,(req, res, next) => {
    console.log("Looged in ",isLoggedIn);
    res.render('rooms/room');
  });
  
  router.post('/room',isLoggedIn,(req,res) => {

      //console.log("post route",isLoggedIn)
      console.log(req,body);
      const { name,description,imageUrl,reviews } = req.body
      console.log(request.session.currentUser);
        const owner = request.session.currentUser;

      Room.create({ name,description,imageUrl,owner,reviews})
          .then((newRoom) => {
              console.log('After create',req.session.currentUser);
              res.redirect('/rooms/room')    
          })
          .catch(error => console.log(error))
  })

  router.get('/room',isLoggedIn, (req, res) => {
    console.log(req.session.username)
    res.render('rooms/room', req.session.currentUser)
})

module.exports = router;
