'use strict';

const {Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';


const inventorySchema = new Schema({
    inventory_product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    inventory_location: {
        type: String,
        default: 'unknown'
    },
    inventory_stock: {
        type: Number,
        required: true,
    },
    inventory_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    inventory_reservations: {
        type: Array,
        default: [],
    }
}, {
    timestamps: true,
    COLLECTION_NAME: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, inventorySchema);


