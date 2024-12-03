'use strict'

const express = require('express')
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const {asyncHander} = require('../../auth/checkAuth');
const {authentication} = require("../../auth/authUtils");

// Signup
router.post('/shop/signup', asyncHander(accessController.signUp));
router.post('/shop/login', asyncHander(accessController.login));

// Authentication
router.use(authentication)

// Logout


module.exports = router;