'use strict';

const { findById } = require('../services/apikey.service');
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
    try {
        if (!req.headers[HEADER.API_KEY]) {
            return res.status(403).json({
                message: 'Forbidden Error',
            });
        }
        const key = req.headers[HEADER.API_KEY].toString();

        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error',
            });
        }

        // check objKey
        const objKey = await findById(key);

        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error',
            });
        }

        req.objKey = objKey;
        return next();
    } catch (e) {
        console.error('Error Check Auth::', e);
    }
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission denied',
            });
        }

        console.log('Permission::', req.objKey.permissions);
        const validPermissions = req.objKey.permissions.includes(permission);

        if (!validPermissions) {
            return res.status(403).json({
                message: 'Permission denied',
            });
        }

        return next();
    };
};

module.exports = { apiKey, permission };
