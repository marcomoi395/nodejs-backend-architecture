'use strict';

const { BadRequestError } = require('../core/error.response');
const inventory = require('../models/inventory.model');
const { getProductById } = require('../models/repositories/product.repo');

class InventoryService {
    static async addStockToInventory({ stock, productId, shopId, location }) {
        const product = await getProductById(productId);

        if (!product) {
            throw new BadRequestError('Products not found');
        }

        const query = { inven_shopId: shopId, inven_productId: productId },
            updateSet = {
                $inc: {
                    inven_stock: stock,
                },
                $set: {
                    inven_location: location,
                },
            },
            option = { upsert: true, new: true };

        return await inventory.findOneAndUpdate(query, updateSet, option);
    }
}

module.exports = InventoryService;
