'use strict'

const cart = require('../models/cart.model')
const {BadRequestError, NotFoundError} = require("../core/error.response");
const {createUserCart, updateUserCartQuantity, updateProductToUserCart, deleteProductFromUserCart, getListUserCart} = require("../models/repositories/cart.repo");
const {findProducts} = require("../models/repositories/product.repo");
const {model} = require("mongoose");
const {product} = require("../models/product.model");

class CartService {

    static async addProductToCart({userId, product = {}}) {
        // Check exist cart
        const userCart = await cart.findOne({cart_userId: userId}).lean()

        if (!userCart) {
            // Create new cart for user
            return await createUserCart({userId, product, model: cart})
        }

        // If there is a shopping cart but no products
        if (!userCart.cart_products.length) {
            // Update product to user cart
            return await updateProductToUserCart({userId, product, model: cart})
        }

        // If the cart exists, the product is there, then update the quantity
        return await updateUserCartQuantity({userId, product, model: cart})
    }

    // Update cart
    /*
    shop_orders_ids: {
        {
            shopId,
            item_products: {
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId,
                }
            },
            version
        }
     */

    static async addProductToCartV2({userId, shop_order_ids = {}}) {
        const {productId, quantity, old_quantity, price} = shop_order_ids?.item_products

        // Check product exist
        const foundProduct = await findProducts({filter: {_id: productId}})
        if (!foundProduct) throw new NotFoundError('Product not found')

        // Compare
        if (foundProduct[0].product_shop.toString() !== shop_order_ids.shopId) {
            throw new NotFoundError('Product not found')
        }

        // Check price with db
        if (price !== foundProduct[0].product_price) throw new BadRequestError("Invalid request")

        if (quantity <= 0) {
            return await deleteProductFromUserCart({userId, productId, model: cart})
        }


        return await updateUserCartQuantity({
            userId, product: {
                productId,
                quantity: quantity - old_quantity
            },
            model: cart
        })

    }

    // Delete Cart
    static async deleteProductFromUserCart({userId, productId}) {
        return await deleteProductFromUserCart({userId, productId, model: cart})
    }

    // Get list cart
    static async getListUserCart({limit, skip, userId}) {
        console.log('userId::', userId)
        return await getListUserCart({limit, skip, userId})
    }
}

module.exports = CartService