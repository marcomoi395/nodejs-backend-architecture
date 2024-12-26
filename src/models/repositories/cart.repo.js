'use strict';

const { convertToObjectId } = require('../../utils');
const cart = require('../cart.model');
const { getProductById } = require('../repositories/product.repo.js');

const createUserCart = async ({ userId, product, model }) => {
    const query = { cart_userId: userId },
        updateOrInsert = {
            $addToSet: {
                cart_products: product,
            },
        },
        options = { upsert: true, new: true };

    return await model.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product, model }) => {
    const { productId, quantity } = product;
    const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active',
        },
        updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity,
            },
        },
        options = { upsert: true, new: true };

    return await model.findOneAndUpdate(query, updateSet, options);
};

const updateProductToUserCart = async ({ userId, product, model }) => {
    const query = {
            cart_userId: userId,
            cart_state: 'active',
        },
        updateSet = {
            $push: {
                cart_products: product,
            },
        },
        options = {
            new: true,
        };
    return await model.findOneAndUpdate(query, updateSet, options);
};

const deleteProductFromUserCart = async ({ userId, productId, model }) => {
    const query = {
            cart_userId: userId,
            cart_state: 'active',
        },
        update = {
            $pull: {
                cart_products: { productId },
            },
        };

    return await model.updateOne(query, update);
};

const getListUserCart = async ({ limit, skip, userId }) => {
    return await cart
        .findOne({
            cart_userId: userId,
        })
        .skip(skip)
        .limit(limit)
        .lean();
};

const findCartById = async ({ cartId }) => {
    return await cart
        .findOne({ _id: convertToObjectId(cartId), cart_state: 'active' })
        .lean();
};

const checkProductByServer = async (products) => {
    return await Promise.all(
        products.map(async (product) => {
            const foundProduct = await getProductById(product.product_id);

            if (foundProduct) {
                return {
                    price: foundProduct.product_price,
                    quantity: foundProduct.product_quantity,
                    product_id: product.product_id,
                };
            }
        })
    );
};

module.exports = {
    createUserCart,
    updateProductToUserCart,
    updateUserCartQuantity,
    deleteProductFromUserCart,
    getListUserCart,
    findCartById,
    checkProductByServer,
};
