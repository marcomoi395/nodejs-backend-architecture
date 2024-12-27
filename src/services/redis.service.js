'use strict';

const redis = require('redis');
const { promisify } = require('util');
const {
    reservationInventory,
} = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pexpireAsync = async (key, ttl) => {
    await redisClient.pexpire(key, ttl);
};

const setnxAsync = async (key, value) => {
    await redisClient.setNX(key, value);
};

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes.lenght; i++) {
        const result = await setnxAsync(key, expireTime);
        console.log('result::', result);

        if (result === 1) {
            // Handle
            const isReversation = await reservationInventory({
                productId,
                quantity,
                cartId,
            });

            if (isReversation.modifiedCount) {
                await pexpire(key, expireTime);
                return key;
            }

            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
};

module.exports = {
    acquireLock,
    releaseLock,
};
