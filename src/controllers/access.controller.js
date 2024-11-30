'use strict'

const {signUp} = require("../services/access.service");

class AccessController {

    signUp = async (req, res, next) => {
        try {
            console.log('[P]::signUp::req.body', req.body)

            /*
            200 - OK
            201 - Created
            */

            return res.status(201).json(await signUp(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessController();