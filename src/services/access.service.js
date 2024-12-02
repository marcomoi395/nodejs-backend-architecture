'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const {createKeyToken} = require("./keyToken.service");
const {createTokenPair} = require("../auth/authUtils");
const {getInfoData} = require("../utils");
const {BadRequestError, InternalServerError} = require("../core/error.response");

const RoleShop = {
    SHOP: '0001',
    WRITER: '0002',
    EDITOR: '0003',
    ADMIN: '0004'
}

class AccessService {

    static signUp = async ({name, email, password}) => {
        try {

            // Check if the email is already in use
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                throw new BadRequestError('Error: Shop already exists');
            }

            // Hash the password
            const hashPassword = await bcrypt.hash(password, 10);

            // Create a new shop
            const newShop = await shopModel.create({
                name,
                email,
                password: hashPassword,
                roles: [RoleShop.SHOP]
            });

            if(newShop){
                /*
                // Generate RSA key pair (PRO)
                const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                })
                */

                const publicKey = crypto.randomBytes(64).toString('hex');
                const privateKey = crypto.randomBytes(64).toString('hex');

                const keyStore = await createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore){
                    throw new InternalServerError('Failed to create keyStore')
                }

                // create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({filed: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 201,
                metadata: null
            }
        } catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            }
            throw new InternalServerError(error.message || 'An unexpected error occurred');
        }
    }
}

module.exports = AccessService;

