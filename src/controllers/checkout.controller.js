'user strict';

const checkoutService = require('../services/checkout.service');
const {
    SuccessResponse,
    ErrorResponse,
} = require('../core/success.response.js');

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Checkout review successfully',
            metadata: await checkoutService.checkoutReview(req.body),
        }).send(res);
    };
}

module.exports = new CheckoutController();
