'use strict'

const express = require('express')
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const {asyncHander} = require('../../auth/checkAuth');

// Signup
router.post('/shop/signup', asyncHander(accessController.signUp));
router.post('/shop/login', asyncHander(accessController.login));
module.exports = router;