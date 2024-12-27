'use strict';

const { convertToObjectId } = require('../../utils');
const inventory = require('../inventory.model');
const { Types } = require('mongoose');

const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = 'unknown',
}) => {
    return await inventory.create({
        inventory_product: productId,
        inventory_shopId: shopId,
        inventory_stock: stock,
        inventory_location: location,
    });
};

const reservationInventory = async ({ productId, quantity, cardId }) => {
    const query = {
            inven_productId: convertToObjectId(productId),
            inven_stock: { $gte: quantity },
        },
        updateSet = {
            $inc: {
                inven_stock: -quantity,
            },
            $push: {
                inven_reservations: {
                    quantity,
                    cartId,
                },
            },
        },
        options = { upsert: true, new: true };

    return await inventory.updateOne(query, updateSet);
};

module.exports = {
    insertInventory,
    reservationInventory,
};

