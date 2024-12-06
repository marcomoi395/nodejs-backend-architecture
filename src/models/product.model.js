'use strict'

const {Schema, model} = require("mongoose");

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: {
        type: String, required: true, trim: true
    }, product_price: {
        type: Number, required: true,
    }, product_description: {
        type: String, required: true,
    }, product_image: {
        type: String, required: true,
    }, product_quantity: {
        type: Number, required: true,
    }, product_type: {
        type: String, required: true, enum: ['Electronics', 'Clothing']
    }, product_shop: {
        type: Schema.Types.ObjectId, ref: 'Shop', required: true
    }, product_attributes: {
        type: Schema.Types.Mixed, required: true
    }
}, {
    timestamps: true, collection: COLLECTION_NAME
})

const clothingSchema = new Schema({
    branch: {
        type: String, required: true
    }, size: {
        type: String, required: true
    }, color: {
        type: String, required: true
    }, material: {
        type: String, required: true
    }, product_shop: {
        type: Schema.Types.ObjectId, ref: 'Shop', required: true
    }
}, {
    timestamps: true, collection: 'Clothing'
})

const electronicsSchema = new Schema({
    manufacturer: {
        type: String, required: true
    }, color: {
        type: String, required: true
    }, warranty: {
        type: String, required: true
    }, product_shop: {
        type: Schema.Types.ObjectId, ref: 'Shop', required: true
    }
}, {
    timestamps: true, collection: 'Electronics'
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronics: model('Electronics', electronicsSchema)
}
