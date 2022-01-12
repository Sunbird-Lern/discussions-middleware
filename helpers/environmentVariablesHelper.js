'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'https://dev.sunbirded.org', //'http://nodebb-service:4567/api',
    Authorization:  env.authorization_token || 'd8402b15-1d5f-4d84-9fae-595ef805f287', // '9c1adb65-14a9-421d-be75-6006f49c85b6',
    nodebb_api_slug: env.nodebb_api_slug || '/discussions/api',
    enable_notifications: env.enable_notifications || true
}

module.exports = devEnvVariables;