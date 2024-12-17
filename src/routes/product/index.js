'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// Authentication
router.get('/search', asyncHandler(productController.getAllListSearchProduct));
router.get('', asyncHandler(productController.findAllProduct));
router.get('/:id', asyncHandler(productController.findProduct));


router.use(authentication);

router.post('/add', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.patch('/publish/:id', asyncHandler(productController.publishProduct));
router.patch('/unpublish/:id', asyncHandler(productController.unPublishProduct));

// Query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop));

module.exports = router;


