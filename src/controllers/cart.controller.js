'use strict'

const CartService = require('../services/cart.service')
const {SuccessResponse} = require('../core/success.response');

class CartController {

    addProductToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful add product to cart',
            metadata: await CartService.addProductToCart(req.body)
        }).send(res)
    }

    // Change quantity product in cart
    updateProductInCart  = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful add product to cart',
            metadata: await CartService.addProductToCartV2(req.body)
        }).send(res)
    }

    // Delete Product From User Cart
    deleteProductFromUserCart  = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful delete user cart',
            metadata: await CartService.deleteProductFromUserCart(req.body)
        }).send(res)
    }

    //Get List User Cart
    getListUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful get list user cart',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}


module.exports = new CartController()
