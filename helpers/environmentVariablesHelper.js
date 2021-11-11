'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'https://dev.sunbirded.org', //'http://nodebb-service:4567/api',
    Authorization:  env.authorization_token || 'd8402b15-1d5f-4d84-9fae-595ef805f287', // '9c1adb65-14a9-421d-be75-6006f49c85b6',
    nodebb_api_slug: env.nodebb_api_slug || '/discussions/api',
    nodebb_session_secret: env.nodebb_session_secret || "DiscussionMiddleware",
    dmw_session_ttl: env.dmw_session_ttl || 24 * 60 * 60 * 1000,
    dmw_redis_connection_string: env.dmw_redis_connection_string || 'redis://127.0.0.1:6379/6',
    memory_store_type: env.memory_store_type || 'redis'
}

module.exports = devEnvVariables;