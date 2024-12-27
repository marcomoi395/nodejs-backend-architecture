'use strict';

const express = require('express');
const router = express.Router();
const InventoryController = require('../../controllers/inventory.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// Authentication
router.use(authentication);

router.post('', asyncHandler(InventoryController.addStockToInventory));

module.exports = router;
