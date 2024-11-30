'use strict'

const JWT = require('jsonwebtoken')
const {decode} = require("jsonwebtoken");

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

module.exports = {createTokenPair}
