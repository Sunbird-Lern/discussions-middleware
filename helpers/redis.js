const Redis = require("ioredis");
var envHelper = require('./environmentVariablesHelper');
var session = require('express-session');
let cluster;
let memoryStore;

function init () {
    try {
        cluster = new Redis(envHelper.dmw_redis_connection_string.toString());
        console.log('Connected to redis.')
        getMemoryStore();
    } catch (error) {
        console.log('Redis connection failed with error: ', error.message)
    }
}

function getMemoryStore () {
    const storeType = envHelper.memory_store_type;
    switch (storeType) {
        case 'in-memory':
            memoryStore = new session.MemoryStore();
            break;
        case 'redis':
            memoryStore = getRedisStoreInstance(session);
            break; 
    }
}

/**
  * @param  {Object} session - Express Session Object
  * @returns {Object} - Redis Store with configured client
  */
 /* istanbul ignore next */
 function getRedisStoreInstance (session) {
    const RedisStore = require('connect-redis')(session);
    return new RedisStore({ client: cluster });
  };

  init();

  module.exports = {
    memoryStore
  };