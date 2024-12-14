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

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (unSelect = []) => {
    return Object.fromEntries(unSelect.map(el => [el, 0]))
}

module.exports = {
    getInfoData,
    getPrivateAndPublicKey,
    getSelectData,
    unGetSelectData
};
