'use strict';

const {Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';


const discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true,
        trim: true,
    },
    discount_description: {
        type: String,
        required: true,
    },
    discount_type: {
        type: String,
        required: true,
        default: 'fixed_amount',
    },
    discount_value: {
        type: Number,
        required: true,
    },
    discount_code: {
        type: String,
        required: true,
    },
    discount_start_date: {
        type: Date,
        required: true,
    },
    discount_end_date: {
        type: Date,
        required: true,
    },
    discount_max_usage: {
        type: Number,
        required: true,
    },
    discount_used_count: {
        type: Number,
        required: true,
    },
    discount_users_used: {
        type: Array,
        default: [],
    },
    discount_max_uses_per_user: {
        type: Number,
        required: true,
    },
    discount_min_order_amount: {
        type: Number,
        required: true
    },
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    discount_is_active: {
        type: Boolean,
        default: true,
    },
    discount_apply_to: {
        type: String,
        required: true,
        enum: ['all_products', 'specific_products'],
    },
    discount_product_ids: {
        type: Array,
        default: [],
    }
}, {
    timestamps: true,
    COLLECTION_NAME: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, discountSchema);



