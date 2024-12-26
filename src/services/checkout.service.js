'use strict';

const { BadRequestError } = require('../core/error.response.js');
const {
    findCartById,
    checkProductByServer,
} = require('../models/repositories/cart.repo.js');
const { getDiscountAmount } = require('./discount.service.js');

class CheckoutService {
    /*
        {
            cardId,
            useId,
            shop_order_ids: {
                {
                    shopId,
                    shop_discount: [],
                    item_products: [
                        {
                            price,
                            quantiry,
                            product_id,
                        }
                    ]
                },
                {
                    shopId,
                    shop_discount: [
                        {
                            "shopId",
                            "discountId",
                            codeId
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            product_id,
                        }
                    ]
                },

            }

        }
    */

    // Login and without login
    static async checkoutReview({ cartId, userId, shop_order_ids }) {
        // Check crardId exist
        const foundCart = await findCartById({ cartId });
        if (!foundCart) {
            throw new BadRequestError('Not found cart');
        }

        const checkoutOrder = {
                totalPrice: 0,
                feeShip: 0,
                totalDiscount: 0,
                totalCheckout: 0,
            },
            shopOrderIdsNew = [];

        // Total Bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {
                shopId,
                shop_discount = [],
                item_products = [],
            } = shop_order_ids[i];

            // Check product availble
            const checkProductServer =
                await checkProductByServer(item_products);

            if (!checkProductServer[0]) {
                throw new BadRequestError('Product not available');
            }

            // Compare with quantity
            checkProductServer.forEach((item) => {
                const quantity = item_products.find(
                    (product) => product.product_id === item.product_id
                ).quantity;

                if (quantity > item.quantity) {
                    throw new BadRequestError('Invalid quantity');
                }

                item.quantity = quantity;
            });

            console.log('checkProductServer', checkProductServer);

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.price * product.quantity;
            }, 0);

            checkoutOrder.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer,
            };

            if (shop_discount.length) {
                const { discount = 0 } = await getDiscountAmount({
                    code: shop_discount[0].codeId,
                    userId,
                    shopId: shop_discount[0].shopId,
                    products: checkProductServer,
                });

                checkoutOrder.totalDiscount += discount;

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
            shopOrderIdsNew.push(itemCheckout);
        }

        return {
            shop_order_ids,
            shop_order_ids_new: shopOrderIdsNew,
            checkout_order: checkoutOrder,
        };
    }
}

module.exports = CheckoutService;
