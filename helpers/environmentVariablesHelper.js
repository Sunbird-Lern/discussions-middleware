'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'https://dev.sunbirded.org', //'http://nodebb-service:4567/api',
    Authorization:  env.authorization_token || '9c1adb65-14a9-421d-be75-6006f49c85b6',
    Nodebb_Slug: '/discussions/api'
}

module.exports = devEnvVariables;