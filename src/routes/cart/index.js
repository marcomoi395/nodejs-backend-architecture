'use strict';

const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');

router.get('/', asyncHandler(cartController.getListUserCart));
router.post('/', asyncHandler(cartController.addProductToCart));
router.post('/update', asyncHandler(cartController.updateProductInCart));
router.delete('/', asyncHandler(cartController.deleteProductFromUserCart));

module.exports = router;


