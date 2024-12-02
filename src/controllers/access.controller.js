'use strict'

const {signUp} = require("../services/access.service");

class AccessController {

    signUp = async (req, res, next) => {
        return res.status(201).json(await signUp(req.body))

    }
}

module.exports = new AccessController();