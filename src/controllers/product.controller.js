'use strict';

const { createProduct, findAllDraftsForShop } = require('../services/product.service');
const { SuccessResponse } = require('../core/success.response');

class ProductController {
    createProduct = async (req, res, next) => {
        console.log(req.user);
        new SuccessResponse({
            message: "Create product successfully",
            metadata: await createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    // -- Query --
    /*
    * @description Get all drafts for shop
    * @param {Number} limit
    * @param {Number} skip
    * @return {JSON}
    */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all drafts successfully',
            metadata: await findAllDraftsForShop({product_shop: req.user.userId}),
        }).send(res);
    }
}

module.exports = new ProductController();
