'use strict';

const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');

router.get(
    '/list_product_code',
    asyncHandler(discountController.getProductsByDiscountCode)
);

// Authentication
router.use(authentication);

router.get('/amount', asyncHandler(discountController.getDiscountAmount));
router.post('/', asyncHandler(discountController.createDiscountCode));
router.get('/', asyncHandler(discountController.getAllDiscountCodes));
router.patch(
    '/update/:codeId',
    asyncHandler(discountController.updateDiscountCode)
);

module.exports = router;
