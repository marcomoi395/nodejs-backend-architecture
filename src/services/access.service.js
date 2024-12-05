'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const {
    createKeyToken, removeKeyById, findByRefreshTokenUsed, findByRefreshToken, updateRefreshToken
} = require("./keyToken.service");
const {createTokenPair, verifyJWT} = require("../auth/authUtils");
const {getInfoData, getPrivateAndPublicKey} = require("../utils");
const {BadRequestError, InternalServerError, AuthFailureError, ForbiddenError} = require("../core/error.response");
const {findEmail, findByEmail} = require("./shop.service");
const {CREATED} = require("../core/success.response");

const RoleShop = {
    SHOP: '0001', WRITER: '0002', EDITOR: '0003', ADMIN: '0004'
}

class AccessService {
    /*
    1 - check this token used?
     */
    static handleRefreshToken = async (refreshToken) => {
        const foundToken = await findByRefreshTokenUsed(refreshToken)

        if (foundToken) {
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)

            await removeKeyById(userId);
            throw new ForbiddenError('Something went wrong, please login again')
        }

        const holderToken = await findByRefreshToken(refreshToken);
        if (!holderToken) {
            throw new AuthFailureError('Shop not register')
        }

        // -- Verify JWT --
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)

        // -- Check UserId --
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Shop not register 2')

        // -- Create New Token --
        const tokens = await createTokenPair({
            userId: foundShop._id, email
        }, holderToken.publicKey, holderToken.privateKey)

        // -- Update RefreshToken --
        await updateRefreshToken(refreshToken, {
            $set: {
                refreshToken: tokens.refreshToken
            }, $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user: {userId, email}, tokens
        }

    }


    static logout = async (keyStore) => {
        return await removeKeyById(keyStore._id)
    }

    static login = async ({email, password, refreshToken = null}) => {
        /*
        1 - Check email in dbs
        2 - Check password
        3 - Create AT vs RT and save
        4 - Generate token pair
        5 - Get data return login
         */

        const foundShop = await findByEmail({email})

        if (!foundShop) {
            throw new BadRequestError('Error: Shop not found')
        }

        const match = bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError('Error: Authentication error')
        }

        // Create PrivateKey and PublicKey
        const {privateKey, publicKey} = getPrivateAndPublicKey();
        // console.log("Private Key::", privateKey)
        // console.log("Public Key::", publicKey)

        // Create token pair
        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)

        await createKeyToken({userId: foundShop._id, publicKey, privateKey, refreshToken: tokens.refreshToken})

        return {
            shop: getInfoData({filed: ['_id', 'name', 'email'], object: foundShop}), tokens
        }

    }

    static signUp = async ({name, email, password}) => {
        try {

            // Check if the email is already in use
            const holderShop = await shopModel.findOne({email}).lean();
            if (holderShop) {
                throw new BadRequestError('Error: Shop already exists');
            }

            // Hash the password
            const hashPassword = await bcrypt.hash(password, 10);

            // Create a new shop
            const newShop = await shopModel.create({
                name, email, password: hashPassword, roles: [RoleShop.SHOP]
            });

            if (newShop) {
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

                const {privateKey, publicKey} = getPrivateAndPublicKey();

                const keyStore = await createKeyToken({
                    userId: newShop._id, publicKey, privateKey
                })

                if (!keyStore) {
                    throw new InternalServerError('Failed to create keyStore')
                }

                // create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                return {
                    code: 201, metadata: {
                        shop: getInfoData({filed: ['_id', 'name', 'email'], object: newShop}), tokens
                    }
                }
            }

            return {
                code: 201, metadata: null
            }
        } catch (error) {
            throw new InternalServerError(error.message || 'An unexpected error occurred');
        }
    }
}

module.exports = AccessService;

