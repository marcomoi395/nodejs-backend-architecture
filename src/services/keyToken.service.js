'use strict';

const keyTokenModel = require('../models/keytoken.model');
const {Types} = require('mongoose');

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            /*
            level 0
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey,
                privateKey
            });

            return tokens ? tokens.publicKey : null;
            */

            // level xxx
            const filter = {user: userId},
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken,
                },
                options = {upsert: true, new: true};

            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );

            return tokens ? tokens.publicKey : null;
        } catch (e) {
            return e;
        }
    };

    static findByUserId = async (userId) =>
        await keyTokenModel
            .findOne({user: new Types.ObjectId(userId)})
            .lean();

    static removeKeyById = async (id) =>
        await keyTokenModel
            .deleteOne({_id: id})
            .lean();

    static findByRefreshTokenUsed = async (refreshToken) =>
        await keyTokenModel
            .findOne({refreshTokensUsed: refreshToken})
            .lean();

    static findByRefreshToken = async (refreshToken) =>
        await keyTokenModel.findOne({refreshToken}).lean();


    static updateRefreshToken = async (refreshToken, payload) =>
        await keyTokenModel.updateOne({refreshToken}, payload).lean();

}

module.exports = KeyTokenService;
