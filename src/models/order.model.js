'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const orderSchema = new Schema(
    {
        order_user: { type: String, require: true },
        order_checkout: { type: Object, default: {} },
        /*
         * order_checkout: {
         *  totalPrice,
         *  totalApllyDiscount,
         *  feeShip
         * }
         */
        order_shipping: { type: Object, default: {} },
        /*
         * order_shipping: {
         * street,
         * city,
         * state,
         * country
         * }
         */
        order_payment: { type: Object, default: {} },
        order_products: { type: Array, required: true },
        order_trackingNumber: { type: String, default: '' },
        order_status: {
            type: String,
            enum: ['pending', 'confirm', 'shipped', 'cancel', 'delivered'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
