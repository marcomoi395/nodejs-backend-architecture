'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// Authentication
router.use(authentication);

router.post('/add', asyncHandler(productController.createProduct));
router.put('/publish/:id', asyncHandler(productController.changeProductStatus));

// Query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop));

module.exports = router;


