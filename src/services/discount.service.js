'use strict'

/*
Discount service
1. Generate discount code (admin, shop)
2. Get discount amount (user)
3. Get all discount codes (user, shop)
4. Verify discount code (user)
5. Delete discount code (admin, shop)
6. Cancel discount code (user)
 */

const {BadRequestError} = require("../core/error.response");
const discount = require('../models/discount.model')
const {convertToObjectId, removeUndefined, updateNestedObjectParser} = require("../utils");
const {findAllProduct} = require("../models/repositories/product.repo");
const {
    findAllDiscountCodeUnSelect, findAllDiscountCodeSelect, updateDiscount, checkDiscountExist
} = require("../models/repositories/discount.repo");

class DiscountService {

    // Generate discount code
    static async createDiscountCode(payload) {
        const {
            name,
            description,
            type,
            value,
            start_date,
            end_date,
            max_usage,
            max_uses_per_user,
            min_order_amount,
            shopId,
            code,
            is_active,
            apply_to,
            product_ids
        } = payload
        // Check time
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) throw new BadRequestError('Discount code has expired')


        if (new Date(start_date) > new Date(end_date)) throw new BadRequestError('Start date must be before end date')

        // Create index for discount code
        const foundDiscount = await checkDiscountExist({
            filter: {
                discount_code: code, discount_shopId: convertToObjectId(shopId)
            }, model: discount
        })

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code already exists')
        }

        // Create discount code
        return await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_usage: max_usage,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_amount: min_order_amount,
            discount_shopId: convertToObjectId(shopId),
            discount_is_active: is_active,
            discount_apply_to: apply_to,
            discount_product_ids: apply_to === 'all' ? [] : product_ids
        })
    }

    static async updateDiscount({code, shopId, payload}) {
        // Remove attr has null and undefined
        const objectParams = removeUndefined(this)

        return await updateDiscount({
            code, shopId, payload: updateNestedObjectParser(objectParams), model: discount
        })
    }

    static async getAllDiscountCodesAvailableWithProduct({code, shopId, userID, limit, page}) {
        // create index for discount code
        const foundDiscount = await checkDiscountExist({
            filter: {
                discount_code: code, discount_shopId: convertToObjectId(shopId)
            }, model: discount
        })

        if (!foundDiscount || !foundDiscount.discount_is_active) throw new BadRequestError('Discount code does not exist')

        const {discount_apply_to, discount_product_ids} = foundDiscount
        let products = []
        if (discount_apply_to === 'alll') {
            // Get all products
            products = await findAllProduct({
                select: ['product_name'], filter: {
                    product_shop: convertToObjectId(shopId)
                }, sort: 'ctime', limit: +limit, page: +page
            })
        }
        if (discount_apply_to === 'specific') {
            products = await findAllProduct({
                select: ['product_name'], filter: {
                    product_shop: convertToObjectId(shopId), _id: {$in: discount_product_ids}
                }, sort: 'ctime', limit: +limit, page: +page
            })
        }

        return products
    }

    static async getAllDiscountCodesByShop({limit, page, shopId}) {
        return await findAllDiscountCodeUnSelect({
            limit: +limit, page: +page, filter: {
                discount_shopId: convertToObjectId(shopId), discount_is_active: true
            }, unSelect: ['__v', 'discount_shopId'], model: discount
        })
    }

    static async getDiscountAmount({code, userId, shopId, products}) {

        const foundDiscount = await checkDiscountExist({
            filter: {
                discount_code: code, discount_shopId: convertToObjectId(shopId)
            }, model: discount
        })

        if (!foundDiscount || !foundDiscount.discount_is_active) throw new BadRequestError('Discount code does not exist')

        const {
            discount_max_usage, discount_value, discount_type, discount_max_usage_per_user, discount_users_used, discount_start_date, discount_end_date, discount_min_order_amount
        } = foundDiscount

        if (discount_max_usage === 0) throw new BadRequestError('Quantity discount code is out of stock')
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) throw new BadRequestError('Discount code has expired')

        let totalOrder = 0
        if (discount_min_order_amount > 0) {
            // Get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_amount) throw new BadRequestError('Discount requires a minimum order amount')
        }

        if (discount_max_usage_per_user > 0) {
            const userDiscount = discount_users_used.find(user => user === userId)

            if (userDiscount){
                // Check max usage per user
                throw new BadRequestError('Account has exceeded the number of times allowed for use')
            }
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            'discount': amount,
            'totalPrice': totalOrder - amount
        }
    }


}

