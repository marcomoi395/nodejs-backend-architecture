'use strict';

const _ = require('lodash');
const crypto = require('node:crypto');

const getInfoData = ({ filed = [], object = {} }) => {
    return _.pick(object, filed);
};

const getPrivateAndPublicKey = () => {
    return {
        privateKey: crypto.randomBytes(64).toString('hex'),
        publicKey: crypto.randomBytes(64).toString('hex'),
    };
};

module.exports = {
    getInfoData,
    getPrivateAndPublicKey,
};
