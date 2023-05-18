const env = require('dotenv').config();
var express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/model');
const Favorite = require('../models/favorite');
const bcrypt = require('bcrypt');
var router = express.Router();
const cheerio = require('cheerio');
const auth = require('../middleware/auth.middleware');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('login');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/dashboard', function (req, res, next) {
  fetch('https://rickandmortyapi.com/api/character')
    .then((response) => response.json())
    .then((json) => {
      // Pass the character data to the view template
      res.render('dashboard', { characters: json.results });
    })
    .catch((err) => {
      console.error(err);
      res.render('error');
    });
});
router.post('/register', async function (req, res, next) {
  // req body and push to database
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  user.save();
  // sign the token
  const token = jwt.sign(
    {
      user: user._id,
    },
    process.env.ACCSESS_TOKEN_SECRET || 'secret'
  );
  console.log(token);

  // send the token in a HTTP-only cookie

  res
    .cookie('jwt', token, {
      httpOnly: true,
    })
    .send();
  res.redirect('/login');
});

router.post('/login', async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      console.log('User authenticated successfully');
      res.redirect('/dashboard');
    } else {
      console.log('Invalid password');
      res.redirect('/login');
    }
  } else {
    console.log('User not found');
    res.redirect('/login');
  }
});
router.get('/favorites', function (req, res, next) {
  Favorite.find({})
    .then(function (favorites) {
      res.render('favorites', { favorites: favorites });
    })
    .catch(function (err) {
      console.error(err);
      res.sendStatus(500);
    });
});

const axios = require('axios');
const async = require('hbs/lib/async');

router.get('/favorites/:id', async function (req, res, next) {
  try {
    // Fetch character data from the Rick and Morty API
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/${req.params.id}`
    );

    // Extract the name and status properties from the response data
    const { name, status, image } = response.data;

    // Create a new favorite object and save it to the database
    //
    const favorite = new Favorite({
      character_id: req.params.id,
      character_name: name,
      status: status,
      character_image: image,
    });
    console.log(favorite);
    await favorite.save();

    // Redirect the user back to the dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/delete/:id', async function (req, res) {
  const character = await Favorite.findByIdAndDelete(req.params.id);
  console.log(character);
  // code to delete character with ID = req.params.id

  res.redirect('/favorites'); // redirect to favorites page after deleting
});
router.get('/edit/:id', async function (req, res) {
  const character = await Favorite.findById(req.params.id);
  res.render('character.edit.ejs', { character: character });
});

router.post('/edit/:id', async function (req, res) {
  const { name, status } = req.body;
  const character = await Favorite.findByIdAndUpdate(
    req.params.id,
    { character_name: name, status },
    { new: true }
  );
  console.log(character);
  res.redirect('/favorites');
});
module.exports = router;
