'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('login',{ user: req.user });
});

router.get('/new', (req, res, next) => {
  res.render('new',{ user: req.user });
});

module.exports = router;