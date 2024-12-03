'use strict'

const {signUp, login, logout} = require("../services/access.service");
const {OK, CREATED, SuccessResponse} = require('../core/success.response')

class AccessController {

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout successfully',
            metadata: await logout(req.keyStore),
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login successfully',
            metadata: await login(req.body),
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Sign up successfully',
            metadata: await signUp(req.body),
        }).send(res)
    }
}

module.exports = new AccessController();