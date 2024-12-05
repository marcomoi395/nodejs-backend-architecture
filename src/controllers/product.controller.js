'use strict'

const {createProduct} = require("../services/product.service");
const {SuccessResponse} = require('../core/success.response')

class ProductController {

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout successfully',
            metadata: await createProduct(req.body.product_type, req.body),
        }).send(res)
    }
}

module.exports = new ProductController();