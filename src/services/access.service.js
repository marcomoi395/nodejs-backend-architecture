'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const {createKeyToken} = require("./keyToken.service");
const {createTokenPair} = require("../auth/authUtils");
const {getInfoData} = require("../utils");

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
                return {
                    code: '40001',
                    message: 'Shop already exists',
                    status: 'error'
                }
            }

            // Hash the password
            const hashPassword = await bcrypt.hash(password, 10);
            console.log('hashPassword::', hashPassword)

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

                console.log({privateKey, publicKey})
                console.log({privateKey, publicKey})

                const keyStore = await createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore){
                    return {
                        code: 'xxxx',
                        message: 'Error create keyStore',
                        status: 'error'
                    }
                }

                // create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log('Created Token Success::', tokens)

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
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;

