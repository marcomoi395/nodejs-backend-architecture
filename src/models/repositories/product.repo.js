'use strict'

const {product, electric, clothing} = require('../product.model');
const shopModel = require('../shop.model');
const {Types} = require("mongoose");
const {getSelectData, unGetSelectData} = require("../../utils");

const queryProduct = async ({query, limit, skip}) => await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({updatedAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()

const findAllDraftsForShop = async ({query, limit = 50, skip = 0}) => await queryProduct({query, limit, skip})

const findAllPublishedForShop = async ({query, limit = 50, skip = 0}) => await queryProduct({query, limit, skip})

const publishProduct = async ({product_id, product_shop}) => {
    const foundProduct = await product.findOne({
        product_shop, _id: new Types.ObjectId(product_id)
    })

    if (!foundProduct) return null

    // Use updateOne to update the found document
    const {modifiedCount} = await product.updateOne({_id: foundProduct._id}, {
        $set: {
            isDraft: false, isPublished: true
        }
    })

    return modifiedCount
}

const unPublishProduct = async ({product_id, product_shop}) => {
    const foundProduct = await product.findOne({
        product_shop, _id: new Types.ObjectId(product_id)
    })

    if (!foundProduct) return null

    // Use updateOne to update the found document
    const {modifiedCount} = await product.updateOne({_id: foundProduct._id}, {
        $set: {
            isDraft: true, isPublished: false
        }
    })

    return modifiedCount
}

const searchProductByUser = async ({keyword}) => {
    const regexSearch = new RegExp(keyword)
    const result = await product.find({
        isPublished: true, $text: {$search: regexSearch},
    }, {
        score: {$meta: "textScore"}
    }).sort({score: {$meta: "textScore"}}).lean()

    console.log(result)

    return result
}

const findAllProduct = async ({limit, sort, page, select, filter}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    return await product.find({
        ...filter,
        isPublished: true
    }).limit(limit).sort(sortBy).skip(skip).select(getSelectData(select)).lean()
}

const findProducts = async ({filter, unSelect}) =>
    await product.find(filter).select(unGetSelectData(unSelect)).lean()

const updateProductById = async ({productId, payload, isNew = true, model}) =>
    await model.findByIdAndUpdate(productId, {$set: payload}, {new: isNew})


module.exports = {
    findAllDraftsForShop, publishProduct, findAllPublishedForShop, unPublishProduct, searchProductByUser, findAllProduct, findProducts, updateProductById
}