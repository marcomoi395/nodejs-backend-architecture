'use strict'

const DiscountService = require('../services/discount.service')
const {SuccessResponse} = require('../core/success.response');
const {next} = require("lodash/seq");
const {model} = require("mongoose");

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful code generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    updateDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Update discount successfully",
            metadata: await DiscountService.updateDiscount({
                codeId: req.params.codeId,
                payload: req.body,
            }),
        }).send(res);
    }

    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful code found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful code found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
                userId: req.user.userId
            })
        }).send(res)
    }

    getProductsByDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful code found',
            metadata: await DiscountService.getProductsByDiscountCode({
                ...req.query,
            })
        }).send(res)
    }
}


module.exports = new DiscountController()
