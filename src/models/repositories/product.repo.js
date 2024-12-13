'use strict'

const {product, electric, clothing} = require('../product.model');
const shopModel = require('../shop.model');
const {Types} = require("mongoose");

const queryProduct = async ({query, limit, skip}) =>
    await product
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updatedAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()

const findAllDraftsForShop = async ({query, limit = 50, skip = 0}) =>
    await queryProduct({query, limit, skip})

const findAllPublishedForShop = async ({query, limit = 50, skip = 0}) =>
    await queryProduct({query, limit, skip})

const publishProduct = async ({product_id, product_shop}) => {
    const foundProduct = await product.findOne({
        product_shop, _id: new Types.ObjectId(product_id)
    })

    if(!foundProduct) return null

    // Use updateOne to update the found document
    const { modifiedCount } = await product.updateOne(
        { _id: foundProduct._id },
        { $set: { isDraft: false, isPublished: true } }
    )

    return modifiedCount
}

const unPublishProduct = async ({product_id, product_shop}) => {
    const foundProduct = await product.findOne({
        product_shop, _id: new Types.ObjectId(product_id)
    })

    if(!foundProduct) return null

    // Use updateOne to update the found document
    const { modifiedCount } = await product.updateOne(
        { _id: foundProduct._id },
        { $set: { isDraft: true, isPublished: false } }
    )

    return modifiedCount
}


module.exports = {findAllDraftsForShop, publishProduct, findAllPublishedForShop, unPublishProduct}