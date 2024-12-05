'use strict'

const {product, clothing, electronics} = require('../models/product.model')
const {BadRequestError, InternalServerError, AuthFailureError, ForbiddenError} = require("../core/error.response");

// define Factory class to create product
class ProductFactory{
    /*
    * @param {string} type
    * @param {object} payload
     */

    static async createProduct(type, payload) {

        switch (type){
            case 'Clothing':
                return new Clothing(payload).createProduct()
            case 'Electronics':
                return new Electronics(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid product type ${type}`)
        }
    }
}

// define base product class
class Product{

    constructor({product_name, product_price, product_description, product_image, product_quantity, product_type, product_shop, product_attributes}){
        this.product_name = product_name;
        this.product_price = product_price;
        this.product_description = product_description;
        this.product_image = product_image;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // create new product
    async createProduct() {
        return product.create(this)
    }
}

// define subclass for Clothing and Electronics
class Clothing extends Product{

    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('Clothing not created')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Product not created')

        return newProduct
    }
}

class Electronics extends Product{

    async createProduct() {
        const newElectronics = await clothing.create(this.product_attributes)
        if(!newElectronics) throw new BadRequestError('Electronics not created')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Product not created')

        return newProduct
    }
}

module.exports = ProductFactory;