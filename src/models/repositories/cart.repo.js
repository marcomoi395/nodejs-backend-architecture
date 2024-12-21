'use strict'

const cart = require("../cart.model");
const createUserCart = async ({userId, product, model}) => {
    const query = {cart_userId: userId},
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = {upsert: true, new: true}

    return await model.findOneAndUpdate(query, updateOrInsert, options)
}

const updateUserCartQuantity = async ({userId, product, model}) => {
    const {productId, quantity} = product
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    }, updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }, options = {upsert: true, new: true}

    return await model.findOneAndUpdate(query, updateSet, options)
}

const updateProductToUserCart = async ({userId, product, model}) => {
    const query = {
        cart_userId: userId,
        cart_state: 'active'
    }, updateSet = {
        $push: {
            cart_products: product
        }
    }, options = {
        new: true
    }
    return await model.findOneAndUpdate(query, updateSet, options)
}

const deleteProductFromUserCart = async ({userId, productId, model}) => {
    const query = {
        cart_userId: userId,
        cart_state: 'active'
    }, update = {
        $pull: {
            cart_products: {productId}
        }
    }

    return await model.updateOne(query, update)
}

const getListUserCart = async ({limit, skip, userId}) => {
    return await cart.findOne({
        cart_userId: userId
    }).skip(skip).limit(limit).lean()
}


module.exports = {
    createUserCart,
    updateProductToUserCart,
    updateUserCartQuantity,
    deleteProductFromUserCart,
    getListUserCart
}