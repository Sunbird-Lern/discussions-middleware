'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'https://staging.sunbirded.org', //'http://nodebb-service:4567/api',
    Authorization:  env.authorization_token || 'fc5448c9-1816-474e-8720-19ea4e42464b', // '9c1adb65-14a9-421d-be75-6006f49c85b6',
    nodebb_api_slug: env.nodebb_api_slug || '/discussions/api'
}

let local = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'http://localhost:4567', //'http://nodebb-service:4567/api',
    Authorization:  env.authorization_token || '71cc8c13-7bb8-40de-8ce6-f79001899292', // '9c1adb65-14a9-421d-be75-6006f49c85b6',
    nodebb_api_slug: env.nodebb_api_slug || '/api'
}

let preprod = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'https://preprod.ntp.net.in', //'http://nodebb-service:4567/api',
    Authorization:  env.authorization_token || '854be73d-64b0-41e6-bd3e-45bc54fd089a', // '9c1adb65-14a9-421d-be75-6006f49c85b6',
    nodebb_api_slug: env.nodebb_api_slug || '/discussions/api'
}

module.exports = devEnvVariables;