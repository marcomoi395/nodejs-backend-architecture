'use strict'

const JWT = require('jsonwebtoken')
const {decode} = require("jsonwebtoken");
const asyncHandler = require("../helper/asyncHandler");
const {AuthFailureError, NotFoundError} = require("../core/error.response");
const {findByUserId} = require("../services/keyToken.service");

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err) {
                console.log('error verify::', err)
            } else {
                console.log('decode verify::', decode)
            }
        })

        return {accessToken, refreshToken}
    } catch (e) {
        console.log('error create token pair::', e)
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    /*
    * 1 - Check userId missing?
    * 2 - Get accessToken
    * 3 - Verify Token
    * 4 - Check user in dbs?
    * 5 - Check keyStore with this user
    * 6 - return next
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid Request')
        req.keyStore = keyStore
        return next();
    }catch (e) {
        throw e
    }
})

const verifyJWT = async (token, keySecret) => {
    return (await JWT.verify(token, keySecret))
}

module.exports = {createTokenPair, authentication, verifyJWT}
