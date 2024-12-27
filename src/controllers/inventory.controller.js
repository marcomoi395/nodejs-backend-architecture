'use strict';

const InventoryService = require('../services/inventory.service');
const { SuccessResponse } = require('../core/success.response');

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful add stock to inventory',
            metadata: await InventoryController.addStockToInventory(req.body),
        }).send(res);
    };
}

module.exports = new InventoryController();
