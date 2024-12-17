'use strict';

const { createProduct, findAllDraftsForShop, findAllPublishedForShop, publishProduct, unPublishProduct, searchProductByUser, findAllProduct, updateProduct} = require('../services/product.service');
const { SuccessResponse } = require('../core/success.response');
class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create product successfully",
            metadata: await createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    // Update Product
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Update product successfully",
            metadata: await updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        }).send(res);
    }

    // -- PATCH --
    publishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Change product status successfully',
            metadata: await publishProduct({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    }

    unPublishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Change product status successfully',
            metadata: await unPublishProduct({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    }

    // -- GET (Query) --
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

    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all published successfully',
            metadata: await findAllPublishedForShop({product_shop: req.user.userId}),
        }).send(res);
    }

    getAllListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search product successfully',
            metadata: await searchProductByUser({keyword: req.query.keyword}),
        }).send(res);
    }

    findAllProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find all product successfully',
            metadata: await findAllProduct(req.query),
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find product successfully',
            metadata: await findProduct({product_id: req.params.id}),
        }).send(res);
    }
}

module.exports = new ProductController();
