'use strict'

import {convertToObjectId, getSelectData, unGetSelectData} from "../../utils";
import discount from "../discount.model";

const findAllDiscountCodeUnSelect = async ({limit = 50, page = 1, sort = 'ctime', filter, unSelect, model}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    return await model.find({
        ...filter,
        isPublished: true
    }).limit(limit).sort(sortBy).skip(skip).select(unGetSelectData(unSelect)).lean()
}


const findAllDiscountCodeSelect = async ({limit = 50, page = 1, sort = 'ctime', filter, select, model}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    return await model.find({
        ...filter,
        isPublished: true
    }).limit(limit).sort(sortBy).skip(skip).select(getSelectData(select)).lean()
}

const updateDiscount = async ({code, shopId , payload, isNew = true, model}) =>
    await model.findByIdAndUpdate({discount_code: code, discount_shopId: convertToObjectId(shopId)}, {$set: payload}, {new: isNew})

const checkDiscountExist = async ({filter, model}) => {
    return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    updateDiscount,
    checkDiscountExist
}