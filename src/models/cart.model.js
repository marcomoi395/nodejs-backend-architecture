'use strict';

const {Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';


const cartSchema = new Schema({
    cart_state: {
        type: String, require: true, enum: ['active', 'completed', 'pending', 'failed'], default: 'active'
    },
    cart_products: {
        type: Array, require: true, defaults: []
    },
    cart_count_products: {
        type: Number, require: true, defaults: 0
    },
    cart_userId: {
        type: String, require: true,
    }
}, {
    timestamps: true,
    COLLECTION_NAME: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, cartSchema);


