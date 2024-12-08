'use strict'

const {product, electric, clothing} = require('../product.model');

const findAllDraftsForShop = async ({query, limit = 50, skip = 0}) =>
    await product
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updatedAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()


module.exports = {findAllDraftsForShop}